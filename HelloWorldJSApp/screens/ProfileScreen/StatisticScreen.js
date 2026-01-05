import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

import { getUserSessions, getUserSessionsCalendar } from '../../api/auth';
import styles_profile from './styles_profile.js';

export default function StatisticScreen({ user, token }) {
  const [range, setRange] = useState('month');
  const [data, setData] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [activeDays, setActiveDays] = useState([]);

  useEffect(() => {
    fetchSessions(user,range);
  }, [range]);

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

  const daysInMonth = Array.from(
    { length: dayjs(currentMonth).daysInMonth() },
    (_, i) => i + 1
  );

  return (
    <View style={styles_profile.container}>
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
      {loadingTimeline ? (
        <Text style={styles_profile.text}>Chargement...</Text>
      ) : (
        <View style={styles_profile.list}>
          {data.map(item => (
            <View key={item.period} style={styles_profile.row}>
              <Text style={styles_profile.text}>{item.period}</Text>
              <Text style={styles_profile.text}>
                {item.sessions} séance(s)
              </Text>
            </View>
          ))}
        </View>
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
    </View>
  );
}
