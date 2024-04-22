import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Option from './components/Option';
import Results from './components/Results';
import { useEffect, useState } from 'react';
import { quizData } from './components/questions';

// Define TypeScript types
type OptionSelection = "option1" | "option2" | "option3" | "option4";
interface Question {
  question: string;
  options: string[];
  answer: string;
}



const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TIMER_DURATION = 10; // in seconds

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [checkIfSelected, setCheckIfSelected] = useState<Record<OptionSelection, boolean>>({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);

  useEffect(() => {
    setQuestions(shuffleArray(quizData));
  }, []);

  useEffect(() => {
    const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    setPercentageComplete(percentage);
    setTimer(TIMER_DURATION);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      handleNext();
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleNext = () => {
    const correctAnswer = questions[currentQuestionIndex]?.answer;

    if (selectedOption === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevQuestion => prevQuestion + 1);
    } else {
      setShowResult(true);
    }

    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    });
  };

  const checkOption = (option: OptionSelection) => {
    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
      [option]: true,
    });
  };

  const restart = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setQuestions(shuffleArray(questions));
  };

  if (showResult) return <Results restart={restart} score={score} />;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView>
        <View style={styles.countwrapper}>
          <Text style={{ fontWeight: "600" }}>{currentQuestionIndex + 1}/{questions.length}</Text>
        </View>

        <View style={styles.questionwrapper}>
          <View style={styles.progresswrapper}>
            <View style={[styles.progressBar, { width: `${percentageComplete}%` }]}></View>
            <View style={styles.progresscount}>
              <Text style={styles.percentage}>{percentageComplete}%</Text>
            </View>
          </View>
          <Text style={{ fontWeight: "500", textAlign: "center" }}>
            {questions[currentQuestionIndex]?.question}
          </Text>
          <Text style={{ fontWeight: "400", textAlign: "center", marginTop: 5 }}>
            Time Left: {timer} seconds
          </Text>
        </View>

        <View style={styles.optionswrapper}>
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <Option
              key={index}
              setSelectedOption={setSelectedOption}
              checkIfSelected={() => checkOption(`option${index + 1}` as OptionSelection)}
              isSelected={checkIfSelected[`option${index + 1}` as OptionSelection]}
              option={option}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={styles.btn}>
          <Text style={{ color: "white", fontWeight: "600" }}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  countwrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  questionwrapper: {
    marginTop: 60,
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    alignItems: "center",
  },
  progresswrapper: {
    width: 70,
    height: 70,
    backgroundColor: "#ABD1C6",
    borderRadius: 50,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
    marginTop: -50,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#228b22",
    alignSelf: "flex-end",
  },
  progresscount: {
    height: 58,
    width: 58,
    borderRadius: 50,
    backgroundColor: "#fff",
    zIndex: 10,
    position: "absolute",
    top: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 18,
    color: "#228b22",
  },
  optionswrapper: {
    marginTop: 40,
    width: "100%",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#228b22",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

});
