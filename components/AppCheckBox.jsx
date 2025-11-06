import { StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export const AppCheckBox = ({ label, checked, onChange, disabled
 }) => (
    <Checkbox.Item
        label={label}
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => onChange(!checked)}
        color='#284394'
        style={styles.checkboxItem}
        disabled={disabled}
    />
);

const styles = StyleSheet.create({

    checkboxItem: {
        paddingVertical: 5,
    },
});