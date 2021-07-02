import React from "react";
import QuizeSingleChoice from "..";
import { create, act } from "react-test-renderer";
import { render } from "@testing-library/react-native";
const data = [
  {
    question: "q1",
    R1: "R1",
    R2: "R2",
    answer: "R1",
  },
  {
    question: "q2",
    R21: "R21",
    R22: "R22",
    answer: "R22",
  },
];
function getComponent(data, props) {
  const originData = [
    {
      question:
        "Pendant la préhistoire, quelle période a suivi l’age de la pierre taillée ?",
      optionA: "l’âge de la pierre polie",
      optionB: "l’âge du fer",
      optionC: "l’âge du bronze",
      optionD: "l’âge de la pierre ponce",
      answer: "l’âge de la pierre polie",
    },
  ];
  return (
    <QuizeSingleChoice
      containerStyle={{ backgroundColor: "#61dafb", paddingTop: 30 }}
      questionTitleStyle={{ fontSize: 22, color: "#FFF" }}
      responseStyle={{
        borderRadius: 15,
      }}
      responseTextStyle={{ fontSize: 12, fontWeight: "normal" }}
      selectedResponseStyle={{
        borderRadius: 15,
        backgroundColor: "#fa5541",
      }}
      selectedResponseTextStyle={{
        fontSize: 14,
        fontWeight: "normal",
      }}
      responseRequired={true}
      nextButtonText={"Next"}
      nextButtonStyle={{ backgroundColor: "#06d755" }}
      nextButtonTextStyle={{ color: "#FFF" }}
      prevButtonText={"Prev"}
      prevButtonStyle={{ backgroundColor: "#fa5541" }}
      prevButtonTextStyle={{ color: "#FFF" }}
      endButtonText={"Done"}
      endButtonStyle={{ backgroundColor: "#000" }}
      endButtonTextStyle={{ color: "#FFF" }}
      buttonsContainerStyle={{ marginTop: "auto" }}
      onEnd={(results) => {}}
      data={data || originData}
      {...props}
    />
  );
}

describe("<QuizeSingleChoice />", () => {
  test("render correctly", () => {
    const tree = render(getComponent(data));
    expect(tree).toBeDefined();
  });
  test("prev disabled", () => {
    const tree = create(getComponent());
    const prev = tree.root.findByProps({ testID: "prev" }).props;
    expect(prev.disabled).toBe(true);
  });
  test("prev not desabled", async () => {
    const tree = create(getComponent(data));
    const prev = tree.root.findByProps({ testID: "prev" });
    const next = tree.root.findByProps({ testID: "next" });
    const R1 = tree.root.findByProps({ testID: "R1" });
    expect(next.props.disabled).toBe(true);
    act(() => {
      R1.props.onPress();
    });
    expect(next.props.disabled).toBe(false);
    act(() => {
      next.props.onPress();
    });
    expect(R1.props.title).toBe("R1");
    expect(prev.props.disabled).toBe(false);
  });

  test("next not disabled", async () => {
    const tree = create(
      getComponent(data, {
        responseRequired: false,
      })
    );
    const next = tree.root.findByProps({ testID: "next" });
    expect(next.props.disabled).toBe(false);
  });

  test("get results", async () => {
    const handelEnd = jest.fn((data) => {
      console.log("data", data);
      return data.map((d) => d.isRight);
    });
    const tree = create(
      getComponent(data, {
        onEnd: handelEnd,
      })
    );
    const next = tree.root.findByProps({ testID: "next" });
    act(() => tree.root.findByProps({ testID: "R1" }).props.onPress());
    act(() => next.props.onPress());
    act(() => tree.root.findByProps({ testID: "R21" }).props.onPress());
    act(() => next.props.onPress());
    expect(handelEnd).toBeCalled();
  });
});
