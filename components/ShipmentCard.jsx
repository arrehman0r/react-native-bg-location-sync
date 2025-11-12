import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import {
  CalenderIcon,
  TimmeIcon,
  ShippingIcon,
  ClientNotesIcon,
  CargoIcon,
  DropOffLocationIcon,
  PickUpLocationIcon,
} from '../assets/svg';
import AppButton from './AppButton';

const shipmentData = {
  id: 'SHP-2025-001236',
  status: 'Assigned',
  pickup: {
    location: 'Dammam Port Terminal',
    date: '23/10/2025',
    time: '02:15 PM',
  },
  dropoff: {
    location: 'Riyadh Logistics Hub',
  },
  cargo: 'Electronics-10 Pallets',
  notes: 'Handle with care. Fragile items.',
};

const ShipmentCard = () => {
  const theme = useTheme();

  const primaryColor = '#4e5c8a';
  const assignedColor = '#d9e0f3';
  const assignedTextColor = primaryColor;
  const rejectColor = '#e74c3c';
  const acceptColor = '#2ecc71';

  const DottedLine = ({ style }) => (
    <View style={[styles.dottedLineContainer, style]}>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.dottedLineDot} />
      ))}
    </View>
  );

  const Section = ({ icon: IconComp, title, content, style }) => (
    <View style={[styles.sectionContainer, style]}>
      <IconComp width={22} height={22} style={styles.sectionIcon} />
      <View style={styles.sectionTextContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
      </View>
    </View>
  );

  const LocationItem = ({ isPickup = false, locationName, date, time }) => {
    const IconComp = isPickup ? PickUpLocationIcon : DropOffLocationIcon;
    const iconColor = isPickup ? '#e74c3c' : acceptColor;

    return (
      <View style={styles.locationItemWrapper}>
        <View style={styles.locationIconContainer}>
          <IconComp width={22} height={22} style={styles.locationIcon} />
        </View>

        <View style={styles.locationTextContainer}>
          <Text style={[styles.locationTitle, { color: iconColor }]}>
            {isPickup ? 'Pickup Location' : 'Drop-off Location'}
          </Text>
          <Text style={styles.locationName}>{locationName}</Text>

          {isPickup && (
            <View style={styles.dateTimeContainer}>
              <CalenderIcon width={18} height={18} />
              <Text style={styles.dateTimeText}>{date}</Text>
              <TimmeIcon width={18} height={18} />
              <Text style={styles.dateTimeText}>{time}</Text>
            </View>
          )}
        </View>

        {!isPickup && <View style={styles.timelineSpacer} />}
        {isPickup && <DottedLine style={styles.timelineDottedLine} />}
      </View>
    );
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ShippingIcon width={26} height={26} style={styles.shipmentIcon} />
            <View>
              <Text style={styles.shipmentIdLabel}>Shipment ID</Text>
              <Text style={styles.shipmentIdValue}>{shipmentData.id}</Text>
            </View>
          </View>

          <View style={[styles.statusChip, { backgroundColor: assignedColor }]}>
            <Text style={[styles.statusText, { color: assignedTextColor }]}>
              {shipmentData.status}
            </Text>
          </View>
        </View>

        {/* <View style={styles.divider} /> */}

        {/* --- Timeline --- */}
        <View style={styles.timelineSection}>
          <LocationItem
            isPickup
            locationName={shipmentData.pickup.location}
            date={shipmentData.pickup.date}
            time={shipmentData.pickup.time}
          />
          <LocationItem locationName={shipmentData.dropoff.location} />
        </View>

        <View style={styles.divider} />

        {/* --- Details --- */}
        <View style={styles.detailsSection}>
          <Section icon={CargoIcon} title="Cargo" content={shipmentData.cargo} style={styles.cargoSection} />
          <Section icon={ClientNotesIcon} title="Client Notes" content={shipmentData.notes} />
        </View>

        {/* --- Action Buttons --- */}
        <View style={styles.actions}>

          <AppButton title="Reject" width={"49%"}/>
          {/* <TouchableOpacity
            style={[styles.button, { backgroundColor: rejectColor }]}
            onPress={() => console.log('Rejected')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity> */}

          <AppButton title="Accept" width="49%" color="#59BA39"/>
{/* 
          <TouchableOpacity
            style={[styles.button, { backgroundColor: acceptColor }]}
            onPress={() => console.log('Accepted')}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity> */}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#f4f4f4', padding: 10 },
  contentContainer: { paddingVertical: 10 },
  card: {
    marginHorizontal: 10,
    borderRadius: 8,
 
  
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C5C5F6',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: "#C5C5F6", borderBottomWidth: 1, alignItems: 'center', padding: 20,  backgroundColor:"#C5C5F626"
 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  shipmentIcon: { marginRight: 10 },
  shipmentIdLabel: { fontSize: 12, color: '#888' },
  shipmentIdValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusChip: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '500', fontFamily: 'Poppins-Medium' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 20, marginVertical: 5 },
  timelineSection: { paddingHorizontal: 20, paddingVertical: 10 },
  locationItemWrapper: { flexDirection: 'row', position: 'relative', marginBottom: 10 },
  locationIconContainer: { zIndex: 1 },
  locationIcon: { marginRight: 15 },
  locationTextContainer: { flex: 1, paddingRight: 10, paddingBottom: 5 },
  locationTitle: { fontSize: 12, fontWeight: '400', marginBottom: 2, fontFamily: 'Poppins-Regular' },
  locationName: { fontSize: 12, fontWeight: '500', color: '#333', fontFamily: 'Poppins-Medium' },
  dateTimeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: '#f9f9f9', paddingVertical: 5, paddingHorizontal: 5, borderRadius: 4 },
  dateTimeText: { fontSize: 14, color: '#555', marginLeft: 5, marginRight: 5 },
  dottedLineContainer: { position: 'absolute', left: 8, top: 30, bottom: 0, width: 2, alignItems: 'center', overflow: 'hidden' },
  dottedLineDot: { width: 3, height: 6, backgroundColor: '#ccc', borderRadius: 3, marginBottom: 4 },
  timelineDottedLine: { height: '100%', top: 30, bottom: 5 },
  timelineSpacer: { height: 20 },
  detailsSection: { padding: 20, paddingTop: 10, paddingBottom: 15 },
  sectionContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  sectionIcon: { marginTop: 2, marginRight: 15 },
  sectionTextContent: { flex: 1 },
  sectionTitle: { fontSize: 12, color: '#7A8A97', marginBottom: 2, fontFamily: 'Poppins-Regular' },
  sectionContent: { fontSize: 12, fontWeight: '500', color: '#2B3034', fontFamily: 'Poppins-Medium' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 0, gap: "2%" },
  button: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8, marginHorizontal: 5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ShipmentCard;
