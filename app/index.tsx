import { StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import data from "../data/data";
import Pagination from "../components/GetStarted/Pagination";
import ButtonGetStarted from "../components/GetStarted/ButtonGetStarted";
import PageGetStarted from "../components/GetStarted/PageGetStarted";

export default function Index() {
  // @ts-ignore
  const flatlistRef = useAnimatedRef<FlatList>();
  const flatlistIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== null) {
      flatlistIndex.value = viewableItems[0].index;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.FlatList
          ref={flatlistRef}
          data={data}
          onScroll={onScroll}
          renderItem={({ item, index }) => {
            return <PageGetStarted item={item} index={index} x={x} />;
          }}
          keyExtractor={(item) => item.id.toString()}
          scrollEventThrottle={16}
          horizontal
          bounces={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 100,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
      </View>
      <View style={styles.buttomContainer}>
        <Pagination data={data} x={x} />
        <ButtonGetStarted
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          x={x}
          dataLength={data.length}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
