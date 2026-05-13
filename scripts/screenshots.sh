#!/usr/bin/env bash

APP_PACKAGE="com.coldcode.orbe"
OUTPUT_DIR="./screenshots"

BASE_W=1080
BASE_H=1920
HOME_TAB_X=200
HOME_TAB_Y=1800
HABITS_TAB_X=540
HABITS_TAB_Y=1800
TASKS_TAB_X=880
TASKS_TAB_Y=1800
FIRST_HABIT_X=200
FIRST_HABIT_Y=420
FIRST_TASK_X=200
FIRST_TASK_Y=480

BACK_KEY=4

DEVICES=("emulator-5554" "emulator-5556" "emulator-5558")

mkdir -p "$OUTPUT_DIR"

go_back() {
  adb -s "$1" shell input keyevent $BACK_KEY >/dev/null 2>&1
  sleep 0.45
}

close_modal_if_open() {
  adb -s "$1" shell input keyevent $BACK_KEY >/dev/null 2>&1
  sleep 0.35
  adb -s "$1" shell input tap 980 80 >/dev/null 2>&1
  sleep 0.35
}

take_shot() {
  local serial="$1" name="$2"
  local out="$OUTPUT_DIR/${serial}_${name}.png"
  adb -s "$serial" exec-out screencap -p > "$out"
  echo "✔ $serial -> $name"
}

get_screen_size() {
  local serial="$1"
  local size
  size=$(adb -s "$serial" shell wm size 2>/dev/null | tr -d '\r')
  echo "$size" | awk -F': ' '{print $NF}'
}

scale_x() {
  local serial="$1" baseX="$2"
  local size=$(get_screen_size "$serial")
  local sw=$(echo "$size" | cut -d'x' -f1)
  echo $(( baseX * sw / BASE_W ))
}

scale_y() {
  local serial="$1" baseY="$2"
  local size=$(get_screen_size "$serial")
  local sh=$(echo "$size" | cut -d'x' -f2)
  echo $(( baseY * sh / BASE_H ))
}

set_theme() {
  local serial="$1" mode="$2"
  if [ "$mode" = "dark" ]; then
    adb -s "$serial" shell cmd uimode night yes >/dev/null 2>&1 || adb -s "$serial" shell settings put secure ui_night_mode 2 >/dev/null 2>&1
  else
    adb -s "$serial" shell cmd uimode night no >/dev/null 2>&1 || adb -s "$serial" shell settings put secure ui_night_mode 1 >/dev/null 2>&1
  fi
  sleep 0.6
}

bring_app_foreground() {
  local serial="$1"
  adb -s "$serial" shell monkey -p "$APP_PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
  sleep 0.9
}

run_sequence_on() {
  local serial="$1"
  local theme="$2"

  echo "Running on $serial theme=$theme"
  set_theme "$serial" "$theme"
  bring_app_foreground "$serial"

  # 1) Home
  take_shot "$serial" "${theme}_01-home"

  # 2) Habits tab
  local hx=$(scale_x "$serial" $HABITS_TAB_X)
  local hy=$(scale_y "$serial" $HABITS_TAB_Y)
  adb -s "$serial" shell input tap $hx $hy
  sleep 1.0
  bring_app_foreground "$serial"
  take_shot "$serial" "${theme}_02-habits"

  # 3) Open first habit details (history)
  local fhx=$(scale_x "$serial" $FIRST_HABIT_X)
  local fhy=$(scale_y "$serial" $FIRST_HABIT_Y)
    local size=$(get_screen_size "$serial")
    local sw=$(echo "$size" | cut -d'x' -f1)
    local sh=$(echo "$size" | cut -d'x' -f2)
    local contentW=900
    if [ "$sw" -gt 1200 ]; then
      contentW=1100
    elif [ "$sw" -gt 1000 ]; then
      contentW=1000
    fi
    local leftOffset=$(( (sw - contentW) / 2 ))

    local fhx=$(( (FIRST_HABIT_X * sw / BASE_W) + leftOffset ))
  adb -s "$serial" shell input tap $fhx $fhy
  sleep 1.0
  bring_app_foreground "$serial"
  adb -s "$serial" shell input swipe 500 1200 500 600 300 >/dev/null 2>&1 || true
  sleep 0.6
  take_shot "$serial" "${theme}_03-habit-history"
  go_back "$serial"
  sleep 0.6

  # 4) Tasks tab
  local tx=$(scale_x "$serial" $TASKS_TAB_X)
  local ty=$(scale_y "$serial" $TASKS_TAB_Y)
  adb -s "$serial" shell input tap $tx $ty
  sleep 1.0
  bring_app_foreground "$serial"
  take_shot "$serial" "${theme}_04-tasks"

  bring_app_foreground "$serial"
}

for serial in "${DEVICES[@]}"; do
  status=$(adb devices | grep "$serial" || true)
  if [[ -z "$status" ]]; then
    echo "Skipping $serial — not found in adb devices"
    continue
  fi
  if [[ "$status" != *device* ]]; then
    echo "Skipping $serial — not ready: $status"
    continue
  fi

  echo "=== Running for $serial ==="
  adb -s "$serial" wait-for-device
  adb -s "$serial" shell 'while [ "$(getprop sys.boot_completed)" != "1" ]; do sleep 1; done;'

  run_sequence_on "$serial" light
  run_sequence_on "$serial" dark
done

echo "All done. Screenshots in $OUTPUT_DIR"