import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import React, { useEffect, useRef } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  onSelect: (minutes: number) => void
  selectedMinutes?: number | null
}

const OPTIONS = [5,10,15,20,25,30,45,60,90,120,180,240,360,480,720,1440]

export default function DurationCarousel({ onSelect, selectedMinutes }: Props) {
  const { theme } = useTheme()
  const width = Dimensions.get('window').width
  const itemHeight = 64
  const itemSpacing = 12 
  const totalItemHeight = itemHeight + itemSpacing
  const visibleItems = 3
  const listHeight = totalItemHeight * visibleItems
  const ref = useRef<FlatList<number>>(null)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  function label(m: number) {
    if (m >= 1440) return `${Math.round(m/1440)}d`
    if (m >= 60) return `${m/60}h`
    return `${m}m`
  }

  useEffect(() => {
    if (selectedMinutes != null && activeIndex === null) {
      const idx = OPTIONS.indexOf(selectedMinutes)
      if (idx >= 0) {
        setTimeout(() => {
          ref.current?.scrollToOffset({ offset: idx * totalItemHeight, animated: false })
          setActiveIndex(idx)
        }, 50)
      }
    }
  }, [selectedMinutes])
  

  return (
    <View style={{ height: listHeight, paddingVertical: 6 }}>
      <FlatList
        ref={ref}
        data={OPTIONS}
        keyExtractor={(i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={totalItemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingTop: totalItemHeight, paddingBottom: totalItemHeight }}
        getItemLayout={(_, index) => ({ length: totalItemHeight, offset: totalItemHeight * index, index })}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.y
          const idx = Math.round(offset / totalItemHeight)
          if (idx !== activeIndex) {
            setActiveIndex(idx)
            const mins = OPTIONS[Math.max(0, Math.min(OPTIONS.length - 1, idx))]
            onSelect(mins)
          }
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const selected = (selectedMinutes === item) || (activeIndex === index)
          return (
            <TouchableOpacity onPress={() => onSelect(item)} activeOpacity={0.8} style={[styles.card, { height: itemHeight, backgroundColor: selected ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border, width: width - 48 }]}> 
              <Text style={{ color: selected ? '#fff' : theme.colors.text, fontWeight: '700', textAlign: 'center' }}>{label(item)}</Text>
            </TouchableOpacity>
          )
        }}
        onMomentumScrollEnd={(e) => {
          const offset = e.nativeEvent.contentOffset.y
          const idx = Math.round(offset / totalItemHeight)
          const mins = OPTIONS[Math.max(0, Math.min(OPTIONS.length - 1, idx))]
          setActiveIndex(idx)
          onSelect(mins)
        }}
      />

      <Text style={{ textAlign: 'center', color: theme.colors.muted, marginTop: 8 }}>{t('duration.dragToSelect')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { marginVertical: 6, alignSelf: 'center', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, paddingHorizontal: 12 },
  centerOverlay: { position: 'absolute', left: 0, right: 0, top: '50%', height: 0, justifyContent: 'center', alignItems: 'center' },
  centerLine: { width: '60%', borderTopWidth: 2 }
})
