"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ButtonState =
  | "Idle"
  | "Touch Down"
  | "Touch Hold"
  | "Touch Release"
  | "Selected"
  | "Disabled";

type DebugRecord = {
  id: string;
  state: ButtonState;
  motion: string;
  target: string;
};

type AssetButtonProps = {
  id: string;
  label: string;
  sprite: "start" | "continue" | "chapters" | "capsule" | "settings";
  memory?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onAction?: () => void;
  onDebug: (record: DebugRecord) => void;
};

function AssetButton({
  id,
  label,
  sprite,
  memory = false,
  disabled = false,
  selected = false,
  onAction,
  onDebug,
}: AssetButtonProps) {
  const [state, setState] = useState<ButtonState>(
    disabled ? "Disabled" : selected ? "Selected" : "Idle",
  );
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePointer = useRef<number | null>(null);

  useEffect(() => {
    setState(disabled ? "Disabled" : selected ? "Selected" : "Idle");
  }, [disabled, selected]);

  const motionFor = (next: ButtonState) => {
    if (memory) {
      if (next === "Touch Down") return "MOTION_MEMORY_AWAKEN";
      if (next === "Touch Hold") return "MOTION_AWAKENING_HOLD";
      if (next === "Touch Release") return "MOTION_MEMORY_CONFIRMED";
      return "MOTION_DORMANT_MEMORY";
    }
    if (next === "Touch Down") return "MOTION_BUTTON_PRESS";
    if (next === "Touch Hold") return "MOTION_BUTTON_HOLD";
    if (next === "Touch Release") return "MOTION_BUTTON_RELEASE";
    return "MOTION_BUTTON_IDLE";
  };

  const report = (next: ButtonState) => {
    setState(next);
    onDebug({
      id,
      state: next,
      motion: motionFor(next),
      target: `#${id}`,
    });
  };

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const cancel = () => {
    clearHold();
    activePointer.current = null;
    report(selected ? "Selected" : "Idle");
  };

  return (
    <button
      id={id}
      data-testid={id}
      data-state={state}
      data-sprite={sprite}
      className={`asset-button state-${state
        .toLowerCase()
        .replaceAll(" ", "-")}`}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected}
      onPointerDown={(event) => {
        if (disabled || activePointer.current !== null) return;
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        report("Touch Down");
        holdTimer.current = setTimeout(() => report("Touch Hold"), 360);
      }}
      onPointerUp={(event) => {
        if (disabled || activePointer.current !== event.pointerId) return;
        clearHold();
        activePointer.current = null;
        const bounds = event.currentTarget.getBoundingClientRect();
        const valid =
          event.clientX >= bounds.left - 12 &&
          event.clientX <= bounds.right + 12 &&
          event.clientY >= bounds.top - 8 &&
          event.clientY <= bounds.bottom + 8;
        if (!valid) {
          cancel();
          return;
        }
        report("Touch Release");
        window.setTimeout(() => {
          report(selected ? "Selected" : "Idle");
          onAction?.();
        }, memory ? 520 : 180);
      }}
      onPointerCancel={cancel}
      onLostPointerCapture={clearHold}
    >
      <span className="asset-button__sprite" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function SceneOne() {
  const [debug, setDebug] = useState(false);
  const [selected, setSelected] = useState("BTN_START_MEMORY");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [handoff, setHandoff] = useState<"idle" | "confirmed" | "open">("idle");
  const [record, setRecord] = useState<DebugRecord>({
    id: "BTN_START_MEMORY",
    state: "Selected",
    motion: "MOTION_DORMANT_MEMORY",
    target: "#BTN_START_MEMORY",
  });

  const startMemory = () => {
    setHandoff("confirmed");
    setRecord({
      id: "BTN_START_MEMORY",
      state: "Touch Release",
      motion: "MOTION_SCENE_HANDOFF",
      target: "#SCENE_HANDOFF",
    });
    window.setTimeout(() => setHandoff("open"), 1900);
  };

  const resetHandoff = () => {
    setHandoff("idle");
    setSelected("BTN_START_MEMORY");
    setRecord({
      id: "BTN_START_MEMORY",
      state: "Selected",
      motion: "MOTION_DORMANT_MEMORY",
      target: "#BTN_START_MEMORY",
    });
  };

  return (
    <main className="showcase-shell">
      <div className="orientation-notice">
        <span>请横握手机</span>
        <small>本Demo固定为1280×720横屏画布</small>
      </div>

      <section
        className="game-stage asset-stage"
        aria-label="昨日重现主菜单UI验证场景"
      >
        <img
          className="scene-art"
          src="/assets/主界面底图.jpg"
          alt=""
          draggable={false}
        />

        <nav className="asset-menu" aria-label="主菜单">
          <AssetButton
            id="BTN_START_MEMORY"
            label="开始回忆"
            sprite="start"
            memory
            selected={selected === "BTN_START_MEMORY"}
            onAction={startMemory}
            onDebug={setRecord}
          />
          <AssetButton
            id="BTN_CONTINUE"
            label="继续昨日"
            sprite="continue"
            disabled
            onDebug={setRecord}
          />
          <AssetButton
            id="BTN_CHAPTERS"
            label="章节选择"
            sprite="chapters"
            selected={selected === "BTN_CHAPTERS"}
            onAction={() => setSelected("BTN_CHAPTERS")}
            onDebug={setRecord}
          />
          <AssetButton
            id="BTN_CAPSULE"
            label="时间胶囊"
            sprite="capsule"
            selected={selected === "BTN_CAPSULE"}
            onAction={() => setSelected("BTN_CAPSULE")}
            onDebug={setRecord}
          />
          <AssetButton
            id="BTN_SETTINGS"
            label="设置"
            sprite="settings"
            selected={settingsOpen}
            onAction={() => {
              setSettingsOpen((open) => !open);
              setSelected("BTN_SETTINGS");
            }}
            onDebug={setRecord}
          />
        </nav>

        <button
          className={`debug-toggle asset-debug-toggle ${debug ? "is-active" : ""}`}
          type="button"
          aria-pressed={debug}
          onClick={() => setDebug((active) => !active)}
        >
          {debug ? "DEBUG ON" : "DEBUG OFF"}
        </button>

        <aside
          className={`settings-sheet ${settingsOpen ? "is-open" : ""}`}
          aria-hidden={!settingsOpen}
        >
          <p>附页 · 设置验证</p>
          <h2>旧档案的声音</h2>
          <div className="setting-line">
            <span>环境旧唱片</span>
            <strong>开启</strong>
          </div>
          <div className="setting-line">
            <span>触感反馈</span>
            <strong>柔和</strong>
          </div>
          <button type="button" onClick={() => setSettingsOpen(false)}>
            收回附页
          </button>
        </aside>

        <aside className={`debug-panel ${debug ? "is-visible" : ""}`}>
          <header>
            <span>INTERACTION DEBUG</span>
            <strong>1280×720 LP</strong>
          </header>
          <dl>
            <div><dt>Element ID</dt><dd>{record.id}</dd></div>
            <div><dt>Current State</dt><dd>{record.state}</dd></div>
            <div><dt>Motion ID</dt><dd>{record.motion}</dd></div>
            <div><dt>Touch Target</dt><dd>{record.target}</dd></div>
          </dl>
          <div className="debug-legend">
            <span><i /> Visual</span>
            <span><i /> Hitbox</span>
          </div>
        </aside>

        <div
          id="SCENE_HANDOFF"
          className={`scene-handoff handoff-${handoff}`}
          aria-hidden={handoff === "idle"}
        >
          <div className="archive-book" aria-label="打开的旧相册">
            <div className="book-depth" aria-hidden="true" />

            <div className="revealed-memory">
              <div className="memory-photo">
                <span className="photo-caption">一九九八年 · 夏</span>
              </div>
              <div className="memory-copy">
                <small>MEMORY CONFIRMED</small>
                <h2>第一章 · 儿时的回忆</h2>
                <p>有些记忆褪了色，却从未真正离开。</p>
                <button type="button" onClick={resetHandoff}>
                  合上相册，返回昨日
                </button>
              </div>
            </div>

            <div className="turning-leaf" aria-hidden="true">
              <div className="leaf-face leaf-front" />
              <div className="leaf-face leaf-back" />
              <i className="leaf-thickness" />
              <i className="leaf-curve" />
            </div>

            <div className="spine-shadow" aria-hidden="true" />

            <div className="book-dust" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--dust-index": index,
                      "--dust-x": `${18 + index * 5.5}%`,
                      "--dust-y": `${44 + (index % 4) * 6}%`,
                      "--dust-size": `${2 + (index % 3)}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className="viewport-label">
        SCENE 01 · MAIN MENU SHOWCASE · TOUCH FIRST / NO HOVER
      </p>
    </main>
  );
}
