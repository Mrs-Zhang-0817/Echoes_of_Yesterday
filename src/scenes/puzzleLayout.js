export const DEFAULT_PUZZLE_LAYOUT = {
  panel: { x: 370, y: 120, width: 540, height: 405 },
  pieceScale: 0.7,
  safeMargin: 24,
  snapRadius: 36,
  slots: [
    { x: 397, y: 10 }, { x: 577, y: 10 }, { x: 757, y: 10 },
    { x: 42, y: 170 }, { x: 42, y: 330 }, { x: 1112, y: 170 },
    { x: 1112, y: 330 }, { x: 460, y: 602 }, { x: 694, y: 602 },
  ],
  stacks: [],
};

// ---- 切片定义 ----
// 每个碎片从原图中采样的源矩形（整数像素），避免浮点缝隙
export function getSourceRects(cellW, cellH) {
  // cellW, cellH = 原图宽/高除以 3，向下取整，余数给最后一行/列
  const w0 = cellW;
  const w1 = cellW;
  const w2 = cellW;
  const h0 = cellH;
  const h1 = cellH;
  const h2 = cellH;

  return [
    // row 0
    { sourceX: 0,          sourceY: 0,     sourceW: w0, sourceH: h0 },
    { sourceX: cellW,      sourceY: 0,     sourceW: w1, sourceH: h0 },
    { sourceX: cellW * 2,  sourceY: 0,     sourceW: w2, sourceH: h0 },
    // row 1
    { sourceX: 0,          sourceY: cellH, sourceW: w0, sourceH: h1 },
    { sourceX: cellW,      sourceY: cellH, sourceW: w1, sourceH: h1 },
    { sourceX: cellW * 2,  sourceY: cellH, sourceW: w2, sourceH: h1 },
    // row 2
    { sourceX: 0,          sourceY: cellH*2, sourceW: w0, sourceH: h2 },
    { sourceX: cellW,      sourceY: cellH*2, sourceW: w1, sourceH: h2 },
    { sourceX: cellW * 2,  sourceY: cellH*2, sourceW: w2, sourceH: h2 },
  ];
}

function shuffle(values, rng) {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [output[index], output[other]] = [output[other], output[index]];
  }
  return output;
}

export function createPuzzlePieces(imageWidth, imageHeight, rng = Math.random, layout = DEFAULT_PUZZLE_LAYOUT) {
  // 整数切片 —— imageWidth/imageHeight 不能正好除以 3 时，前两列/行各取 floor，最后一列/行取剩余
  const baseW = Math.floor(imageWidth / 3);
  const baseH = Math.floor(imageHeight / 3);
  const rects = getSourceRects(baseW, baseH);

  const ids = shuffle(Array.from({ length: 9 }, (_, id) => id), rng);
  const cellWidth = layout.panel.width / 3;
  const cellHeight = layout.panel.height / 3;
  const looseWidth = cellWidth * layout.pieceScale;
  const looseHeight = cellHeight * layout.pieceScale;

  return ids.map((id, order) => {
    const row = Math.floor(id / 3);
    const column = id % 3;
    const rect = rects[id];
    const piece = {
      id,
      // 用整数像素的裁剪矩形（不再靠浮点 sourceX/sourceY 自己除）
      sourceX: rect.sourceX,
      sourceY: rect.sourceY,
      sourceW: rect.sourceW,
      sourceH: rect.sourceH,
      targetX: layout.panel.x + column * cellWidth,
      targetY: layout.panel.y + row * cellHeight,
      x: 0,
      y: 0,
      width: looseWidth,
      height: looseHeight,
      targetWidth: cellWidth,
      targetHeight: cellHeight,
      looseWidth,
      looseHeight,
      placed: false,
      dragging: false,
      highlight: 0,
      stackIndex: null,
    };

    if (order < layout.slots.length) {
      piece.x = layout.slots[order].x;
      piece.y = layout.slots[order].y;
    } else {
      const stack = layout.stacks[(order - layout.slots.length) % layout.stacks.length];
      const stackIndex = order - layout.slots.length;
      piece.x = stack.x + stack.offsetX * stackIndex;
      piece.y = stack.y + stack.offsetY * stackIndex;
      piece.stackIndex = stackIndex;
    }
    piece.homeX = piece.x;
    piece.homeY = piece.y;
    piece.ejecting = false;
    piece.ejection = null;
    return piece;
  });
}

export function getTopmostPieceAt(pieces, x, y) {
  return [...pieces].reverse().find(piece =>
    !piece.placed && !piece.ejecting &&
    x >= piece.x && x <= piece.x + piece.width &&
    y >= piece.y && y <= piece.y + piece.height
  ) ?? null;
}

export function ejectPiecesBlockingTarget(pieces, restoredPiece) {
  const rx = restoredPiece.x;
  const ry = restoredPiece.y;
  const rw = restoredPiece.targetWidth ?? restoredPiece.width;
  const rh = restoredPiece.targetHeight ?? restoredPiece.height;

  const ejected = pieces.filter(piece => {
    if (piece === restoredPiece || piece.placed || piece.ejecting) return false;
    return piece.x < rx + rw && piece.x + piece.width > rx &&
           piece.y < ry + rh && piece.y + piece.height > ry;
  });

  for (const piece of ejected) {
    piece.ejecting = true;
    // 恢复为松散尺寸
    piece.width = piece.looseWidth ?? piece.width;
    piece.height = piece.looseHeight ?? piece.height;
    piece.ejection = {
      fromX: piece.x, fromY: piece.y,
      toX: piece.homeX, toY: piece.homeY,
      elapsed: 0, duration: 0.32,
    };
  }
  return ejected;
}

export function snapPieceToTarget(piece, radius) {
  if (Math.hypot(piece.x - piece.targetX, piece.y - piece.targetY) > radius) return false;
  piece.x = piece.targetX;
  piece.y = piece.targetY;
  piece.width = piece.targetWidth;
  piece.height = piece.targetHeight;
  piece.placed = true;
  return true;
}
