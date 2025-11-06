import { View, StyleSheet, Platform } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export const AppSelect = ({ label, selectedValue, onValueChange, items, enabled = true, left, defaultValue }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerWrapper}>
                {left && <View style={styles.iconContainer}>{left}</View>}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={onValueChange}
                        enabled={enabled}
                        dropdownIconColor="#000"
                        style={styles.picker}
                        mode="dropdown"
                        defaultValue={defaultValue}
                    >
                        {items.map((item) => (
                            <Picker.Item 
                                label={item.label} 
                                value={item.value} 
                                key={item.value} 
                            />
                        ))}
                    </Picker>
                </View>
            </View>
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
        marginBottom: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,  // Fixed height as per design
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
       
    },
    picker: {
        width: '100%',
        color: '#000',
        marginTop:  12,  
        marginBottom: 0, 
     
    },
    iconContainer: {
        paddingLeft: 45,       
        alignItems: 'center',
        justifyContent: 'center',
    },
});