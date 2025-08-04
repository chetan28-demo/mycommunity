
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  title: {
    fontSize: 32,  // Larger size for the community name
    fontWeight: '900',
    color: 'Black',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,  // Adding some letter spacing for a cleaner look
  },
  pickerContainer: {
    height:'8%',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#212529',
    borderWidth: 2,
    marginBottom: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,  // Subtle shadow for the picker container
  },
  icon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 60,  // Ensuring picker items are well aligned and visible
    color: '#212529',
    fontSize: 16,
    borderRadius: 10,
    paddingVertical: 10,  // Padding to ensure text is centered properly
  },
  button: {
    // backgroundColor: '#3498db',
    backgroundColor: '#212529',

    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#2980b9',  // Slight shadow to make the button pop
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  changeLanguageButton: {
    backgroundColor: '#ecf0f1',
    // backgroundColor: '#5c677d',

    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#bdc3c7',  // Subtle shadow for language button
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  changeLanguageText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
