import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Dimensions} from 'react-native';
import dayjs from 'dayjs';
import { BarChart } from 'react-native-chart-kit';


import { getUserSessions, getUserSessionsCalendar, getUserValidatedDifficulties } from '../../api/auth';
import styles_profile from './styles_profile.js';

export default function StatisticScreen({ user, token }) {
  const [range, setRange] = useState('month');
  const [data, setData] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [activeDays, setActiveDays] = useState([]);

  const [difficultyStats, setDifficultyStats] = useState([]);
  const [loadingDifficultyStats, setLoadingDifficultyStats] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  useEffect(() => {
    fetchSessions(user,range);
  }, [range]);

  useEffect(() => {
    fetchDifficultyStats();
  }, [range, currentMonth]);

  async function fetchSessions() {
    setLoadingTimeline(true);
    const res = await getUserSessions(user.id, token, range);
    console.log("sessions timeline response:", res);
    if (!res.error) {
      setData(res.data);
      
    }
    setLoadingTimeline(false);
  }

  useEffect(() => {
    fetchCalendar();
  }, [currentMonth]);

  async function fetchCalendar() {
    setLoadingCalendar(true);
    const res = await getUserSessionsCalendar(user.id, token, currentMonth);
    if (!res.error) {
      setActiveDays(res.days || []);
      
    }
    setLoadingCalendar(false);
  }

  async function fetchDifficultyStats() {
    setLoadingDifficultyStats(true);
  
    const res = await getUserValidatedDifficulties(
      user.id,
      token,
      range,
      currentMonth
    );
  
    if (!res.error) {
      setDifficultyStats(res.data);
    }
  
    setLoadingDifficultyStats(false);
  }

  const labels = data.map(item =>
    range === 'month'
      ? dayjs(item.period).format('DD')
      : range === 'year'
      ? dayjs(item.period).format('MMM')
      : item.period
  );
  
  const values = data.map(item => item.sessions);

  const daysInMonth = Array.from(
    { length: dayjs(currentMonth).daysInMonth() },
    (_, i) => i + 1
  );

  const difficultyLabels = Array.from({ length: 14 }, (_, i) => String(i + 1));

  const difficultyValues = difficultyLabels.map(level => {
    const found = difficultyStats.find(d => String(d.grade) === level);
    return found ? found.count : 0;
  });


  return (
    <ScrollView style={styles_profile.container}>
      <Text style={styles_profile.title}>📊 Sessions</Text>

      {/* Filtres */}
      <View style={styles_profile.filters}>
        {['month', 'year', 'all'].map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles_profile.filterBtn,
              range === r && styles_profile.active,
            ]}
            onPress={() => setRange(r)}
          >
            <Text style={styles_profile.filterText}>
              {r === 'month' ? 'Mois' : r === 'year' ? 'Année' : 'Depuis le début'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline */}
      {!loadingTimeline && data.length > 0 && (
        <BarChart
          data={{
            labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          fromZero
          
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: '#1e1e1e',
            backgroundGradientTo: '#1e1e1e',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(97, 218, 251, ${opacity})`,
            labelColor: () => '#fff',
            style: { borderRadius: 16 },
          }}
          style={{
            marginVertical: 16,
            borderRadius: 16,
            alignSelf: 'center',
          }}
        />
      )}

      {/* Header calendrier */}
      <View style={styles_profile.calendarHeader}>
        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(
              dayjs(currentMonth).subtract(1, 'month').format('YYYY-MM')
            )
          }
        >
          <Text style={styles_profile.text}>◀</Text>
        </TouchableOpacity>

        <Text style={styles_profile.text}>
          {dayjs(currentMonth).format('MMMM YYYY')}
        </Text>

        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(
              dayjs(currentMonth).add(1, 'month').format('YYYY-MM')
            )
          }
        >
          <Text style={styles_profile.text}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Calendrier */}
      <View style={styles_profile.calendar}>
        {daysInMonth.map(day => {
          const fullDate = `${currentMonth}-${String(day).padStart(2, '0')}`;
          const hasSession = activeDays.includes(fullDate);

          return (
            <View
              key={day}
              style={[
                styles_profile.day,
                hasSession && styles_profile.activeDay,
              ]}
            >
              <Text style={styles_profile.dayText}>{day}</Text>
            </View>
          );
        })}
      </View>

      {/* Difficultés validées */}
      <Text style={styles_profile.title}>📈 Validated difficulties</Text>

      {!loadingDifficultyStats && (
        <BarChart
          data={{
            labels: difficultyLabels,
            datasets: [{ data: difficultyValues }],
          }}
          width={screenWidth - 32}
          height={240}
          fromZero
          segments={4}
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: '#1e1e1e',
            backgroundGradientTo: '#1e1e1e',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            labelColor: () => '#fff',
          }}
          style={{
            marginVertical: 16,
            borderRadius: 16,
            alignSelf: 'center',
          }}
        />
      )}


    </ScrollView>
  );
}