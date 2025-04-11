import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

export default function Question({ route, navigation }) {
  const { data, index, answers } = route.params;
  const question = data[index];
  
  console.log('Question type:', question.type);
  console.log('Question index:', index);
  
  // Initialize selectedIndex based on question type
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (question.type === 'multiple-answer') {
      return [];
    } else {
      // For multiple-choice, true-false, and any other single-selection types
      return null;
    }
  });
  
  console.log('Initial selectedIndex:', selectedIndex);

  const onSelect = (i) => {
    console.log('onSelect called with index:', i);
    console.log('Current question type:', question.type);
    
    if (question.type === 'multiple-answer') {
      setSelectedIndex((prev) => {
        const newSelectedIndex = prev.includes(i) 
          ? prev.filter((x) => x !== i) 
          : [...prev, i];
        console.log('New selectedIndex (multiple-answer):', newSelectedIndex);
        return newSelectedIndex;
      });
    } else {
      console.log('New selectedIndex (single-answer):', i);
      setSelectedIndex(i);
    }
  };

  const handleNext = () => {
    console.log('handleNext called');
    console.log('Current selectedIndex:', selectedIndex);
    console.log('Current answers:', answers);
    
    const nextAnswers = [...answers, selectedIndex];
    console.log('Next answers:', nextAnswers);
    
    try {
      // Go to the next question or Summary if it's the last question
      if (index + 1 < data.length) {
        console.log('Navigating to next question with index:', index + 1);
        
        // Try using push instead of navigate
        const nextIndex = Number(index) + 1;
        console.log('Next index (calculated):', nextIndex);
        
        navigation.push('Question', {
          data: [...data],
          index: nextIndex,
          answers: [...nextAnswers],
        });
      } else {
        console.log('Navigating to Summary');
        
        navigation.navigate('Summary', {
          data: [...data],
          answers: [...nextAnswers],
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{question.prompt}</Text>
      
      <ButtonGroup
        vertical
        buttons={question.choices}
        selectedIndexes={question.type === 'multiple-answer' ? selectedIndex : undefined}
        selectedIndex={question.type !== 'multiple-answer' ? selectedIndex : undefined}
        onPress={(i) => onSelect(i)}
        testID="choices"
        containerStyle={{ marginBottom: 20 }}
      />

      <Button
        title="Next"
        onPress={() => {
          console.log('Next button pressed');
          handleNext();
        }}
        testID="next-question"
        disabled={
          selectedIndex === null || 
          selectedIndex === undefined || 
          (Array.isArray(selectedIndex) && selectedIndex.length === 0)
        }
      />
    </ScrollView>
  );
}

// Styling
const styles = {
  container: {
    padding: 20,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Example boxShadow
  },
};
