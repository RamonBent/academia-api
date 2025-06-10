import * as React from 'react';
import { Text, Touchable, TouchableOpacity, StyleSheet, View, Image, Dimensions } from "react-native";
import {useWindowDimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export type TreinoProps = {
  title: string;
  duration: string;
  calories: number;
  numberExercises: string;
  onPress?: () => void;
};

export default function Treino({title, duration, calories, numberExercises} : TreinoProps){
    const {height, width} = useWindowDimensions();
    const navigation = useNavigation<any>();

    return(
        <TouchableOpacity style={[styles.container, {width: width * 0.9, height: height * 0.15}]} onPress={() => navigation.navigate('Sobre')}>
            <View style={styles.infos}>
                    <Text style={{textAlign: "center", fontWeight: '800', fontSize: 20, marginBottom: 5}}>{title}</Text>

                <View style={styles.textos}>
                    <Text numberOfLines={1}>🕐 {duration}</Text>
                </View>

                <View style={styles.textos}>
                    <Text numberOfLines={1}>🔥 {calories} kcal</Text>
                </View>

                <View style={styles.textos}>
                    <Text numberOfLines={1}>🏃 {numberExercises}</Text>
                </View>
            </View>        
            <Image style={styles.imagem} source={{uri: 'https://esportenanet.com/wp-content/uploads/2024/10/Chris-Bumstead-idade-altura-peso-titulos-e-historia.png'}} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#AFAFAF',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: "stretch",
        fontFamily: 'Poppins'
    },

    infos: {
        padding:15,
        width: '50%',
        justifyContent: 'center'
    },

    textos: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },

    imagem: {
        width: '50%',
        backgroundColor: '#AFAFAF',
        borderRadius: 10,
    }
})