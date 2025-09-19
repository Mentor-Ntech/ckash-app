import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

interface Props {
  size?: number;
  style?: ViewStyle;
}

export default function CkashLogo({ style, size = 24 }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} viewBox="0 0 105 108">
        <G clipPath="url(#clip0_1816_3209)">
          <Path d="M54.8378 101.467C24.7665 101.467 0.302002 78.621 0.302002 50.5391C0.302002 22.4572 24.7665 -0.37793 54.8378 -0.37793C64.7437 -0.37793 74.4259 2.11897 82.8359 6.84879L84.803 7.95425L72.341 19.5918L71.1867 19.0693C66.0629 16.7374 60.5564 15.5605 54.8319 15.5605C34.1719 15.5605 17.3577 31.2569 17.3577 50.5556C17.3577 69.8544 34.166 85.5398 54.8319 85.5398C60.9215 85.5398 66.8933 84.1593 72.2409 81.5304L57.1582 67.44L41.4041 52.7115L54.4608 40.513L55.7329 41.7559L65.368 50.7701L105.846 88.5701L92.8184 100.736L84.7029 93.157C75.8275 98.6018 65.5329 101.473 54.8319 101.473L54.8378 101.467Z" fill="#E4EBFE"/>
          <Path d="M82.394 13.0085L83.8782 14.3945C83.3481 13.9655 82.8004 13.5475 82.2527 13.146L82.394 13.014V13.0085Z" fill="#E4EBFE"/>
          <Path d="M83.8195 30.7119L74.1491 39.7426L50.8036 61.5438L41.1567 52.5186L64.6907 30.5415L74.3081 21.5603C74.8558 21.9618 75.4035 22.3798 75.9336 22.8088L81.5108 28.0171C82.3177 28.8915 83.0833 29.788 83.8195 30.7064V30.7119Z" fill="#E4EBFE"/>
        </G>
        <Defs>
          <ClipPath id="clip0_1816_3209">
            <Rect width="105" height="108" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
    shadowColor: "rgba(46, 51, 56, 0.15)",
  },
});
