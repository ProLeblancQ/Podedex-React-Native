import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header avec background coloré
  header: {
    paddingBottom: 0,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
  backButton: {
    padding: 10,
  },
  
  backArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  
headerTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  flex: 1,
  textAlign: 'center',
},
  
  pokemonNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Container de l'image Pokémon
  pokemonImageContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  
  pokemonImage: {
    width: 200,
    height: 200,
  },
  
  // Container principal avec fond blanc
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -70,
  },
  
  whiteContent: {
    padding: 20,
    paddingTop: 20,
  },
  
  // Types
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  
  typePill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78C850',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // About section
  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  
  aboutItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  aboutLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  aboutSeparator: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  
  // Description
  pokemonDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  
  // Stats section
  statsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 20,
  },
  
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  statName: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 45,
  },
  
  statSeparator: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 35,
  },
  
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    marginLeft: 15,
    overflow: 'hidden',
  },
  
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  statDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 4,
  },
});