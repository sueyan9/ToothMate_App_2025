import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const questions = [
  {
    question: "How many times a day should you brush your teeth?",
    options: ["Once", "Twice", "Three times", "Only when they feel dirty"],
    answer: "Twice",
  },
  {
    question: "What type of toothpaste should you use for brushing?",
    options: ["Any toothpaste", "Fluoride toothpaste", "Whitening toothpaste only", "Homemade toothpaste"],
    answer: "Fluoride toothpaste",
  },
  {
    question: "How often should you floss?",
    options: ["Once a week", "At least once per day", "Only when food is stuck", "Every few days"],
    answer: "At least once per day",
  },
  {
    question: "When should you replace your toothbrush?",
    options: ["Every month", "Every 6 months", "Every 3-4 months", "When it looks old"],
    answer: "Every 3-4 months",
  },
  {
    question: "What should you limit to maintain good oral health?",
    options: ["Water intake", "Sugary and acidic foods/drinks", "Brushing frequency", "Dental visits"],
    answer: "Sugary and acidic foods/drinks",
  },
  {
    question: "How often should you visit the dentist for check-ups?",
    options: ["Only when in pain", "Every few years", "Regularly for check-ups", "Never needed"],
    answer: "Regularly for check-ups",
  },
];

const GameScreen = ({ navigation }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === questions[currentQ].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const resetGame = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Great job! 🎉</Text>
        <Text style={styles.resultText}>
          You got {score} out of {questions.length} correct!
        </Text>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
       <TouchableOpacity
  style={styles.button}
  onPress={() => {
    navigation.replace('content', {
      id: '1', // Dental Hygiene ID
      fromFilter: 'Oral Care',
      quizCompleted: true,
      quizScore: score,
      totalQuestions: questions.length,
    });
  }}
>
  <Text style={styles.buttonText}>Back to Learning</Text>
</TouchableOpacity>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.progressText}>
          Question {currentQ + 1} of {questions.length}
        </Text>
        <Text style={styles.question}>{questions[currentQ].question}</Text>

        {questions[currentQ].options.map((option, i) => {
          const isCorrect = option === questions[currentQ].answer;
          const isSelected = option === selected;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isSelected && isCorrect && styles.correct,
                isSelected && !isCorrect && styles.wrong,
              ]}
              onPress={() => handleAnswer(option)}
              disabled={!!selected}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default GameScreen;