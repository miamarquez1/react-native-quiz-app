import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Question from './Question';
import Summary from './Summary';

const Stack = createStackNavigator();

const questions = [
  {
    prompt: "What state is the Sunshine State?",
    type: "multiple-choice",
    choices: ["Florida", "Georgia", "California", "Oklahoma"],
    correct: 0, // Florida is the correct answer (index 0)
  },
  {
    prompt: "What are the three states of matter? Choose 3",
    type: "multiple-answer",
    choices: ["Gas", "Solid", "Liquid", "Dirt"],
    correct: [0, 1, 2], // Gas, Solid, and Liquid are the correct answers
  },
  {
    prompt: "Geologists study the earth, rocks, and nature.",
    type: "true-false",
    choices: ["True", "False"],
    correct: 0, // True is the correct answer (index 0)
  },
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{
            data: questions,
            index: 0,
            answers: [], // Starting with an empty answers array
          }}
          options={{
            headerShown: true,
            title: 'Quiz',
            // Add this line to remove the back button
            headerLeft: () => null,
            // Optionally disable the swipe gesture to go back (on iOS)
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Summary"
          component={Summary}
          // You might want to remove the back button from Summary too,
          // so users can't go back to the last question from the summary.
          options={{
             headerLeft: () => null,
             gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
