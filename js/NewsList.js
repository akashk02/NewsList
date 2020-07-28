import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {Card, Icon} from 'native-base';
import {Colors, ActivityIndicator, Switch} from 'react-native-paper';

import debounce from 'lodash.debounce';
import {Transition, Transitioning} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class NewsList extends Component {
  state = {
    grid: false,
    data: [],
    loading: true,
    count: 20,
    page: 1,
    offset: 1,
    initialLoading: true,
  };

  ref = React.createRef();

  transition = (
    <Transition.Together>
      <Transition.In
        type="slide-bottom"
        durationMs={1000}
        interpolation="easeInOut"
      />
      <Transition.In type="fade" durationMs={2000} />
      <Transition.Change />
      <Transition.Out type="fade" duration={2000} />
    </Transition.Together>
  );

  handleToggle = () => {
    this.ref.current.animateNextTransition();

    this.setState({grid: !this.state.grid});
  };

  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    this.setState({loading: true});
    const {count, offset} = this.state;

    fetch(
      `https://api.smallcase.com/news/getNews?count=${count}&offset=${offset}`,
    )
      .then((response) => response.json())
      .then((res) => {
        const data = res?.data?.map((item) => {
          return {
            ...item,
            isPressed: false,
          };
        });

        this.setState((state) => {
          return {
            data: [...state.data, ...data],
            loading: false,
            page: state.page + 1,
            offset: (state.page - 1) * count,
            initialLoading: false,
          };
        });
      })
      .catch((error) => {
        this.setState({loading: false});
        alert(error);
      });
  };

  updateCardOnpressed = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState((state) => {
      const data = state.data;
      console.log('updateCardOnpressed data =', data);

      data[index] = {
        ...data[index],
        isPressed: !data[index]?.isPressed,
      };

      return {
        data,
      };
    });
  };

  renderNewsListTest = ({item, index}) => {
    const {imageUrl, createdAt, headline, summary} = item || {};
    const {isPressed} = this.state.data[index];

    const date = moment(createdAt).format('MMMM Do YYYY');
    const time = moment(createdAt).format('hh:mm:ss a');

    return (
      <Card
        style={{
          padding: 8,
          borderRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.5)',

          marginBottom: 8,
          flex: 1,
        }}>
        <Pressable
          onPress={() => this.updateCardOnpressed(index)}
          style={{flexDirection: 'row'}}>
          <View style={{width: 100, height: 100, flex: 1, padding: 8}}>
            <FastImage
              style={{aspectRatio: 1}}
              source={{
                uri: imageUrl,
                priority: FastImage.priority.normal,
              }}
            />
          </View>

          <View style={{marginLeft: 8, flex: 2}}>
            <Text
              numberOfLines={isPressed ? 100 : 2}
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {headline}
            </Text>
            <Text
              numberOfLines={isPressed ? 100 : 3}
              style={{
                flex: 1,
                flexWrap: 'wrap',
                color: 'white',
                marginTop: 8,
                paddingBottom: 4,
              }}>
              {summary}
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                width: 80,
                borderColor: Colors.blueGrey50,
              }}
            />
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                marginTop: 8,
                color: Colors.blueA100,
              }}>
              {date}
            </Text>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                color: 'white',
              }}>
              {time}
            </Text>
          </View>
        </Pressable>
      </Card>
    );
  };

  renderGridView = ({item}) => {
    const {imageUrl, createdAt} = item || {};

    let date = moment(createdAt).format('MMMM Do YYYY');

    return (
      <Card
        style={{
          flex: 1,
          backgroundColor: Colors.blueGrey800,
          padding: 3,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <FastImage
          style={{aspectRatio: 1, width: '100%', borderRadius: 10}}
          source={{
            uri: imageUrl,
            priority: FastImage.priority.normal,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',

            padding: 8,
          }}>
          <Text style={{color: 'white'}}>{date}</Text>
        </View>
      </Card>
    );
  };

  renderFooterComponent = () => {
    return this.state.loading ? (
      <ActivityIndicator style={{color: '#000', marginVertical: 4}} />
    ) : null;
  };

  renderHeaderComponent = () => {
    return <View style={{paddingVertical: 30}} />;
  };

  fetchNextData = debounce(this.fetchData, 2000);

  onRefresh = () => {
    this.setState({page: 1, offset: 1}, () => {
      this.fetchData();
    });
  };

  render() {
    console.log('state1 =  ', this.state);

    if (this.state.initialLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            style={{color: '#000', marginVertical: 4}}
          />
        </View>
      );
    }

    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            // backgroundColor: 'rgba(52, 52, 52, 0.5)',
            height: 56,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            elevation: 1000,
            zIndex: 1000,
          }}>
          <Text
            style={{
              color: 'white',
              marginLeft: 16,
              fontWeight: 'bold',
            }}>
            News List
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Switch
              style={{marginRight: 16}}
              value={this.state.grid}
              onValueChange={this.handleToggle}
            />
            {this.state.grid ? (
              <Icon
                type="Feather"
                name="grid"
                style={{marginRight: 16, color: 'white'}}
              />
            ) : (
              <Icon
                type="FontAwesome"
                name="list"
                style={{marginRight: 16, color: 'white'}}
              />
            )}
          </View>
        </View>

        <Transitioning.View
          ref={this.ref}
          transition={this.transition}
          style={{
            flex: 1,
            padding: 8,
            backgroundColor: Colors.blueGrey400,
          }}>
          <FlatList
            data={this.state.data}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            renderItem={
              this.state.grid ? this.renderGridView : this.renderNewsListTest
            }
            keyExtractor={(item) => {
              return item._id;
            }}
            key={this.state.grid}
            numColumns={this.state.grid ? 2 : 1}
            horizontal={false}
            extraData={this.state}
            onEndReachedThreshold={0.5}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            onEndReached={() => {
              this.fetchNextData();
            }}
            removeClippedSubviews={true}
            windowSize={50}
            onRefresh={this.onRefresh}
            refreshing={this.state.loading}
            ListFooterComponent={this.renderFooterComponent}
            ListHeaderComponent={this.renderHeaderComponent}
          />
        </Transitioning.View>
      </SafeAreaView>
    );
  }
}
