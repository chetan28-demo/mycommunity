


import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',  // Subtle light gradient background for soft modern aesthetics
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,  // Extra padding for top to make the title prominent
  },
  title: {
    fontSize: 35,  // Larger font size for title to make it stand out
    fontWeight: '900',  // Bold weight for prominence
    color: 'black',  // Dark gray for contrast against soft background
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1.5,  // More letter spacing to give a sophisticated look
    fontFamily: 'Roboto',  // Custom font for better visual appearance
  },
  radioGroup: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,  // Ensuring spacing around content for better visual balance
  },
  radioLabel: {
    fontSize: 20,  // Slightly larger label for better readability
    color: '#34495e',  // Dark color for better contrast
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',  // Using same font for uniformity
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,  // Proper space between radio buttons
    paddingHorizontal: 20,
    paddingVertical: 12,  // Enough padding to make the buttons feel spacious
    borderRadius: 10,  // Rounded edges for smoother feel
    backgroundColor: '#ecf0f1',  // Light grey background for each option
    shadowColor: '#bdc3c7',
    
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  radioButtonText: {
    fontSize: 18,
    color: '#34495e',  // Keeping the text in dark tones for clarity
    marginLeft: 12,  // Spacing out the text from the radio button
    fontFamily: 'Roboto',  // Consistency in font for the text
  },
  button: {
    backgroundColor: '#212529',  // Soft blue color for a modern touch
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,  // Round button with more curvature for a smoother look
    marginTop: 30,
    elevation: 10,  // Soft shadow to give a floating feel
    shadowColor: '#212529',  // A slightly darker shadow for depth
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    transform: [{ scale: 1 }],  // Subtle scale effect on press to give interactivity
    transition: 'transform 0.3s ease-in-out',  // Smooth transition when interacting with the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',  // Slightly lighter than bold for a soft feel
    textAlign: 'center',
    fontFamily: 'Roboto',  // Ensuring the text font matches throughout
  },
  
submitButton: {
  backgroundColor: '#212529',  // Blue color for submit button
  paddingVertical: 16,
  paddingHorizontal: 50,
  borderRadius: 30,  // Rounded corners for smooth aesthetics
  marginTop: 30,  // Space above the button
  elevation: 10,  // Shadow to give depth
  shadowColor: '#2980b9',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 15,
  transform: [{ scale: 1 }],
  transition: 'transform 0.3s ease-in-out',  // Smooth transition effect on press
},

submitButtonText: {
  color: '#fff',  // White color for text on blue button
  fontSize: 20,
  fontWeight: '800',  // Slightly bold to stand out
  textAlign: 'center',  // Center the text in the button
  fontFamily: 'Roboto',  // Consistency with the rest of the app's typography
},
});

export default styles;
