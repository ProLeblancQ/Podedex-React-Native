import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenFill: { flex: 1 },
  animatedFill: { flex: 1 },

  header: {
    paddingBottom: 150,
    position: 'relative',
    zIndex: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: { padding: 10 },
  backArrow: { fontSize: 24, color: 'white', fontFamily: 'FiraSans_700Bold' },

  headerTitle: {
    fontSize: 24,
    fontFamily: 'FiraSans_700Bold',
    color: 'white',
    flex: 1,
    textAlign: 'left',
  },
  pokemonNumber: { fontSize: 16, fontFamily: 'FiraSans_600SemiBold', color: 'white' },

  pokemonImageOverlap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 75,
    alignItems: 'center',
    zIndex: 4,
    elevation: 20,
    pointerEvents: 'none',
  },
  pokemonImage: { 
    width: 170, 
    height: 170,
    zIndex: 10,
    elevation: 10,
  },

  imageNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },

  navLeftBtn: {
    marginLeft: 20,
  },
  
  navRightBtn: {
    marginRight: 20,
  },

  pokemonBackgroundImage: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 220,
    height: 220,
    zIndex: 2,
    elevation: 2,
  },

  whiteCap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -40,
    height: 50,
    backgroundColor: 'white',
    zIndex: 3,
    elevation: 6,
    pointerEvents: 'none',
  },

  contentContainer: { flex: 1, backgroundColor: 'white' },
  contentInner: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 50 },

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
    fontFamily: 'FiraSans_600SemiBold',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FiraSans_700Bold',
    color: '#78C850',
    textAlign: 'center',
    marginBottom: 20,
  },

  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 3,
    marginBottom: 20,
  },
  aboutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  aboutItem: { alignItems: 'center', flex: 1 },
  aboutValue: {
    fontSize: 16,
    fontFamily: 'FiraSans_600SemiBold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutLabel: {
    fontSize: 12,
    fontFamily: 'FiraSans_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  aboutSeparator: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: 10 },

  pokemonDescription: {
    fontSize: 14,
    fontFamily: 'FiraSans_400Regular',
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  statsContainer: { backgroundColor: '#FAFAFA', borderRadius: 10, padding: 20 },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  statName: { fontSize: 14, fontFamily: 'FiraSans_600SemiBold', minWidth: 45 },
  statSeparator: { width: 1, height: 16, backgroundColor: '#E0E0E0', marginHorizontal: 15 },
  statValue: { fontSize: 14, fontFamily: 'FiraSans_600SemiBold', color: '#333', minWidth: 35 },
  statBarContainer: { flex: 1, height: 8, backgroundColor: '#E8F5E8', borderRadius: 4, marginLeft: 15, overflow: 'hidden' },
  statBar: { height: '100%', borderRadius: 4 },
  statDivider: { height: 1, backgroundColor: '#E8E8E8', marginVertical: 4 },

  navCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  navBtnDisabled: { opacity: 0.4 },
  navArrowIcon: {
    fontSize: 22,
    fontFamily: 'FiraSans_700Bold',
    color: '#333',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
