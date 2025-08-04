
import { StyleSheet } from "react-native";
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: hp('2%'),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    marginTop: hp('7%'),
    marginBottom: hp('1.5%'),
  },
  logo: {
    fontSize: wp('7%'),
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: hp('2.5%'),
    marginTop: hp('1.5%'),
  },
logoBold: {
  color: "#111", // dark black
  fontWeight: "900",
  fontSize: wp('7%'),
},
logoLight: {
  color: "#555", // medium grey
  fontWeight: "600",
  fontSize: wp('6.8%'),
},
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: wp('12%'),
    overflow: "hidden",
    width: '80%',
    height: hp('6%'),
    alignSelf: 'center',
    marginBottom: hp('2.5%'),
  },
  toggle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#000",
  },
  toggleText: {
    fontSize: wp('4.2%'),
    fontWeight: "600",
    color: "#666",
  },
  activeToggleText: {
    color: "white",
  },
  formContainer: {
    width: "100%",
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('3.5%'),
    fontWeight: "600",
    color: "#555",
    marginBottom: hp('0.8%'),
    marginLeft: wp('1.5%'),
  },
  genderToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp('2%'),
  },
  genderOption: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    borderRadius: wp('6%'),
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: wp('1.5%'),
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  genderText: {
    color: "#555",
    fontWeight: "600",
    fontSize: wp('4%'),
  },
  genderSelectedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: wp('4%'),
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp('1.8%'),
  },
  nameInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: wp('3.5%'),
    backgroundColor: "#fff",
    height: hp('6.5%'),
    marginHorizontal: wp('1.5%'),
    justifyContent: "center",
  },
  nameInput: {
    fontSize: wp('4%'),
    color: "#333",
    paddingVertical: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: wp('3.5%'),
    marginBottom: hp('2%'),
    height: hp('6.5%'),
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    color: "#333",
    paddingVertical: hp('0.8%'),
    marginLeft: wp('2%'),
  },
  actionButton: {
    backgroundColor: "#000",
    paddingVertical: hp('2%'),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp('4.5%'),
  },
  privacyPolicyContainer: {
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('2.5%'),
  },
  privacyPolicyText: {
    fontSize: wp('3%'),
    color: "#666",
    textAlign: "center",
    lineHeight: hp('2.2%'),
  },
  privacyPolicyLink: {
    color: "#000",
    textDecorationLine: "underline",
    fontWeight: '600',
  },
  errorText: {
    color: "#d32f2f",
    fontSize: wp('3.5%'),
    textAlign: "center",
    marginBottom: hp('1.5%'),
    marginTop: hp('0.8%'),
  },
  headerCentered: {
    alignItems: 'center',
  },
  toggleContainerCentered: {
    alignSelf: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  checkboxChecked: {
    backgroundColor: '#363a3dff',
    borderColor: '#333538ff',
  },
  checkboxCheckmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  termsText: {
    fontSize: wp('3.5%'),
    color: '#666',
    flex: 1,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
