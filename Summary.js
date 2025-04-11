import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Summary({ route }) {
  const { data, answers } = route.params;
  let score = 0;

  // Helper to check if an answer index is correct for a given question
  const isCorrectAnswer = (question, index) => {
    if (question.type === 'multiple-answer') {
      return question.correct.includes(index);
    }
    return question.correct === index;
  };

  // Helper to check if an answer index was selected by the user
  const isUserAnswer = (userAnswer, index) => {
    if (userAnswer === null || userAnswer === undefined) return false; // Handle unanswered
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(index);
    }
    return userAnswer === index;
  };

  const answerFeedback = data.map((question, index) => {
    const userAnswer = answers[index]; // This is the index or array of indices
    let isQuestionCorrect;

    // Check overall correctness for the question
    if (question.type === 'multiple-answer') {
      const sortedUserAnswer = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
      const sortedCorrectAnswer = Array.isArray(question.correct) ? [...question.correct].sort() : [];
      isQuestionCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
    } else {
      isQuestionCorrect = userAnswer === question.correct;
    }

    if (isQuestionCorrect) {
      score++;
    }

    return {
      ...question, // Include all original question data
      userAnswer: userAnswer,
      isCorrect: isQuestionCorrect,
    };
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.scoreText} testID="total">
        Total Score: {score}/{data.length}
      </Text>
      {answerFeedback.map((feedback, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.promptText}>{feedback.prompt}</Text>
          <Text style={[styles.feedbackText, { color: feedback.isCorrect ? 'green' : 'red' }]}>
            {feedback.isCorrect ? 'Correct' : 'Incorrect'}
          </Text>
          <View style={styles.choicesContainer}>
            {feedback.choices.map((choice, choiceIndex) => {
              const isChoiceCorrect = isCorrectAnswer(feedback, choiceIndex);
              const wasChoiceSelected = isUserAnswer(feedback.userAnswer, choiceIndex);

              // Determine styling based on rubric
              const choiceStyle = [styles.choiceText]; // Base style
              if (isChoiceCorrect) {
                choiceStyle.push(styles.correctChoice); // Bold if correct
              }
              if (wasChoiceSelected && !isChoiceCorrect) {
                choiceStyle.push(styles.incorrectSelectedChoice); // Strikethrough if selected and incorrect
              }

              return (
                <Text key={choiceIndex} style={choiceStyle}>
                  - {choice}
                </Text>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// Add styles for the new formatting
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Ensure space at the bottom
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  promptText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 10, // Increased margin
    fontWeight: 'bold',
  },
  choicesContainer: {
    marginTop: 5, // Add some space before choices
  },
  choiceText: {
    fontSize: 16,
    marginBottom: 5, // Space between choices
    color: '#333', // Standard text color
  },
  correctChoice: {
    fontWeight: 'bold', // Correct answers are bold
  },
  incorrectSelectedChoice: {
    textDecorationLine: 'line-through', // Incorrectly selected answers get strikethrough
    color: '#888', // Dim the color slightly for struck-through text
  },
  // Removed old answerLabel and answerText styles as they are replaced by the choice list
});
