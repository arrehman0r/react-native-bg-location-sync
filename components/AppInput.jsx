import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";


export const AppInput = ({ label, maxLength, value, onChangeText, secureTextEntry, placeholder, keyboardType, right, left, disabled , error}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                mode="outlined"
                placeholder={placeholder}
                placeholderTextColor={"#2B3034"}
                placeholderStyle={{ fontSize: 14, fontFamily: 'Poppins_400Regular' }}
                keyboardType={keyboardType}
                left={left}
                style={styles.input}
                outlineStyle={{ borderRadius: 8, borderWidth: 1 }}
                outlineColor="#00005B"
                theme={{ colors: { background: '#F9FAFB'} }}
                disabled={disabled}
                right={right}
                maxLength={ maxLength || 80}
                error={error}
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins_500Medium',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        fontSize: 14,
        fontFamily: 'NunitoSans_400Regular',
        height: 48,
        justifyContent: 'center',

    },
});
