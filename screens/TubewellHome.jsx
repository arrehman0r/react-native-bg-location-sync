import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useCompleteTubewellRequest } from "../services/useQueries";
import { AppHeader } from "../components/AppHeader";
import { TubewellJobCard } from "../components/TubewellJobCard";
import TubewellRequest from "./TubewellRequests";
import TubewellMonthlyBills from "./TubewellsMonthlyBills";

const TubewellHome = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        showLogo={true}
        title="Monthly Bills"
        navigation={navigation}
      />
      {/* <TubewellRequest navigation={navigation} />
       */}

      <TubewellMonthlyBills navigation={navigation} />
    </View>
  );
};

export default TubewellHome;
