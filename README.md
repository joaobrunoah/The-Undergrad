# The-Undergrad

In order to compile in iOS:

* Even in react-native >= 0.60.0, run 
    
    react-native link react-native-vector-icons
    react-native link react-native-firebase
    
* After "pod install", enter in Xcode > Build Phases > [CP] Copy Bundle Resources and delete all fonts

* After that, you are able to Archive and run the app