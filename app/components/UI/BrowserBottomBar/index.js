import React, { PureComponent } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ElevatedView from 'react-native-elevated-view';
import TabCountIcon from '../Tabs/TabCountIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AnalyticsV2 from '../../../util/analyticsV2';
import Device from '../../../util/device';
import { colors } from '../../../styles/common';

const HOME_INDICATOR_HEIGHT = 18;
const defaultBottomBarPadding = 0;

const styles = StyleSheet.create({
	bottomBar: {
		backgroundColor: Device.isAndroid() ? colors.white : colors.grey000,
		flexDirection: 'row',
		paddingBottom:
			Device.isIphoneX() && Device.isIos()
				? defaultBottomBarPadding + HOME_INDICATOR_HEIGHT
				: defaultBottomBarPadding,
		flex: 0,
		borderTopWidth: Device.isAndroid() ? 0 : StyleSheet.hairlineWidth,
		borderColor: colors.grey200,
		justifyContent: 'space-between',
	},
	iconButton: {
		height: 24,
		width: 24,
		justifyContent: 'space-around',
		alignItems: 'center',
		textAlign: 'center',
		flex: 1,
		paddingTop: 30,
		paddingBottom: 30,
	},
	tabIcon: {
		marginTop: 0,
		width: 24,
		height: 24,
	},
	disabledIcon: {
		color: colors.grey100,
	},
	icon: {
		width: 24,
		height: 24,
		color: colors.grey500,
		textAlign: 'center',
	},
});

/**
 * Browser bottom bar that contains icons for navigatio
 * tab management, url change and other options
 */
export default class BrowserBottomBar extends PureComponent {
	static propTypes = {
		/**
		 * Boolean that determines if you can navigate back
		 */
		canGoBack: PropTypes.bool,
		/**
		 * Boolean that determines if you can navigate forward
		 */
		canGoForward: PropTypes.bool,
		/**
		 * Function that allows you to navigate back
		 */
		goBack: PropTypes.func,
		/**
		 * Function that allows you to navigate forward
		 */
		goForward: PropTypes.func,
		/**
		 * Function that triggers the tabs view
		 */
		showTabs: PropTypes.func,
		/**
		 * Function that triggers the change url modal view
		 */
		showUrlModal: PropTypes.func,
		/**
		 * Function that redirects to the home screen
		 */
		goHome: PropTypes.func,
		/**
		 * Function that toggles the options menu
		 */
		toggleOptions: PropTypes.func,
	};

	trackSearchEvent = () => {
		AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.BROWSER_SEARCH_USED, {
			option: 'Browser Bottom Bar Menu',
		});
	};

	trackNavigationEvent = (navigationOption) => {
		AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.BROWSER_NAVIGATION, {
			option: navigationOption,
			os: Platform.OS,
		});
	};

	render() {
		const { canGoBack, goBack, canGoForward, goForward, showTabs, goHome, showUrlModal, toggleOptions } =
			this.props;

		const onSearchPress = () => {
			showUrlModal();
			this.trackSearchEvent();
		};

		const onBackPress = () => {
			goBack();
			this.trackNavigationEvent('Go Back');
		};

		const onForwardPress = () => {
			goForward();
			this.trackNavigationEvent('Go Forward');
		};

		const onHomePress = () => {
			goHome();
			this.trackNavigationEvent('Go Home');
		};

		return (
			<ElevatedView elevation={11} style={styles.bottomBar}>
				<TouchableOpacity
					onPress={onBackPress}
					style={styles.iconButton}
					testID={'go-back-button'}
					disabled={!canGoBack}
				>
					<Icon name="angle-left" size={24} style={[styles.icon, !canGoBack ? styles.disabledIcon : {}]} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onForwardPress}
					style={styles.iconButton}
					testID={'go-forward-button'}
					disabled={!canGoForward}
				>
					<Icon
						name="angle-right"
						size={24}
						style={[styles.icon, !canGoForward ? styles.disabledIcon : {}]}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={onSearchPress} style={styles.iconButton} testID={'search-button'}>
					<FeatherIcons name="search" size={24} style={styles.icon} />
				</TouchableOpacity>

				<TouchableOpacity onPress={showTabs} style={styles.iconButton} testID={'show-tabs-button'}>
					<TabCountIcon style={styles.tabIcon} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onHomePress} style={styles.iconButton} testID={'home-button'}>
					<SimpleLineIcons name="home" size={22} style={styles.icon} />
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleOptions} style={styles.iconButton} testID={'options-button'}>
					<MaterialIcon name="more-horiz" size={22} style={styles.icon} />
				</TouchableOpacity>
			</ElevatedView>
		);
	}
}
