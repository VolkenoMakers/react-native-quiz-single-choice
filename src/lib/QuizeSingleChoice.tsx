import React from "react";
import {
  Animated,
  Dimensions,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { AppButton, OppButton } from "./Buttons";
const { width } = Dimensions.get("window");
type QuestionResponse = {
  question: string;
  answer: string;
};
type Question = { [key: string]: string } & QuestionResponse;
type QuizSingleChoiceProps = {
  containerStyle: ViewStyle;
  questionTitleStyle: TextStyle;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
  selectedResponseStyle: ViewStyle;
  selectedResponseTextStyle: TextStyle;
  nextButtonText: string;
  nextButtonStyle: ViewStyle;
  nextButtonTextStyle: TextStyle;
  endButtonText: string;
  endButtonStyle: ViewStyle;
  endButtonTextStyle: TextStyle;
  prevButtonText: string;
  prevButtonStyle: ViewStyle;
  prevButtonTextStyle: TextStyle;
  buttonsContainerStyle: ViewStyle;
  responseRequired: boolean;
  onEnd: (results: any) => any;
  data: Array<Question>;
};
const QuizSingleChoice = ({
  containerStyle,
  questionTitleStyle,
  responseStyle,
  responseTextStyle,
  selectedResponseStyle,
  selectedResponseTextStyle,
  nextButtonText,
  nextButtonStyle,
  nextButtonTextStyle,
  endButtonText,
  endButtonStyle,
  endButtonTextStyle,
  prevButtonText,
  prevButtonStyle,
  prevButtonTextStyle,
  buttonsContainerStyle,
  responseRequired,
  onEnd,
  data,
}: QuizSingleChoiceProps) => {
  const originalData = data;
  const [questions, setQuestions] = React.useState([
    ...originalData.sort((_) => Math.random() - 0.5),
  ]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const animation = React.useRef(new Animated.Value(0)).current;

  const onAnswer = React.useCallback(
    (_: any, response: string) => {
      const newQuestions = [...questions];
      const activeQuestion = { ...newQuestions[currentIndex] };
      activeQuestion.response = response;
      newQuestions[currentIndex] = activeQuestion;
      setQuestions(newQuestions);
    },
    [questions, currentIndex]
  );
  const onNext = React.useCallback(() => {
    if (currentIndex === questions.length - 1) {
      handleEnd(questions);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions]);
  const onPrev = React.useCallback(() => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);
  const handleEnd = React.useCallback(
    (questions: Question[]) => {
      let newData = [];
      for (let q of questions) {
        newData.push({
          question: q.question,
          response: q.response,
          isRight: q.answer === q.response,
          answer: q.answer,
        });
      }
      onEnd(newData);
    },
    [questions]
  );
  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: currentIndex,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);
  const translateX =
    questions.length > 1
      ? animation.interpolate({
          inputRange: questions.map((_, index) => index),
          outputRange: questions.map((_, index) => -index * width),
        })
      : 0;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;
  let nextDisabled = responseRequired
    ? !!!questions[currentIndex]?.response
    : false;
  return (
    <View
      style={[
        { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 15 },
        containerStyle,
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          width: questions.length * width,
          transform: [{ translateX }],
        }}
      >
        {questions.map((item, index) => (
          <View key={index} style={{ alignSelf: "center", width: width }}>
            <Question
              responseStyle={responseStyle}
              questionTitleStyle={questionTitleStyle}
              selectedResponseStyle={selectedResponseStyle}
              selectedResponseTextStyle={selectedResponseTextStyle}
              responseTextStyle={responseTextStyle}
              key={index}
              onAnswer={onAnswer}
              {...{ item }}
            />
          </View>
        ))}
      </Animated.View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 15,
            alignSelf: "center",
            width: width - 50,
            justifyContent: "space-between",
          },
          buttonsContainerStyle,
        ]}
      >
        <OppButton
          onPress={() => {
            onPrev();
          }}
          disabled={isFirst}
          testID="prev"
          containerStyle={{
            width: "40%",
            backgroundColor: "#F00",
            ...prevButtonStyle,
          }}
          title={prevButtonText}
          titleStyle={[{ color: "#FFF" }, prevButtonTextStyle]}
        />
        <OppButton
          onPress={() => {
            onNext();
          }}
          testID="next"
          disabled={nextDisabled}
          containerStyle={{
            width: "40%",
            backgroundColor: "#000",
            ...(isLast ? endButtonStyle : nextButtonStyle),
          }}
          title={isLast ? endButtonText : nextButtonText}
          titleStyle={[
            { color: "#FFF" },
            isLast ? endButtonTextStyle : nextButtonTextStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default QuizSingleChoice;

function getResposesKeys(item: Question) {
  return Object.keys(item).filter(
    (key) => !["question", "answer", "response"].includes(key)
  );
}

type QuestionProps = {
  item: Question;
  onAnswer: Function;
  questionTitleStyle: TextStyle;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
  selectedResponseStyle: ViewStyle;
  selectedResponseTextStyle: TextStyle;
};
function Question({
  item,
  onAnswer,
  questionTitleStyle,
  responseStyle,
  responseTextStyle,
  selectedResponseStyle,
  selectedResponseTextStyle,
}: QuestionProps) {
  const responses = getResposesKeys(item);
  return (
    <View style={{ marginTop: 30, width: width - 50, alignItems: "center" }}>
      <Text
        style={[
          { textAlign: "center", fontWeight: "700", fontSize: 18 },
          questionTitleStyle,
        ]}
      >
        {item.question}
      </Text>
      <View style={{ marginVertical: 15, width: "100%" }}>
        {responses.map((r, i) => {
          let text = item[r];
          const select = item.response === text;
          return (
            <QuestionItem
              key={i}
              text={text}
              responseTextStyle={
                select ? selectedResponseTextStyle : responseTextStyle
              }
              responseStyle={select ? selectedResponseStyle : responseStyle}
              onPress={() => {
                onAnswer(item, text);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

type QuestionItemProps = {
  text: string;
  onPress: () => any;
  disabled?: boolean;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
};
function QuestionItem({
  text,
  onPress,
  disabled,
  responseStyle,
  responseTextStyle,
}: QuestionItemProps) {
  return (
    <View style={{ marginVertical: 15 }}>
      <AppButton
        title={text}
        disabled={disabled}
        testID={text}
        containerStyle={{ backgroundColor: "#000", ...responseStyle }}
        width={"100%"}
        onPress={onPress}
        titleStyle={{ textTransform: "capitalize", ...responseTextStyle }}
        backgroundColor={"#000"}
        titleColor={"#FFF"}
      />
    </View>
  );
}
