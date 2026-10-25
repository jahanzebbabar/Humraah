import { useLocalSearchParams } from 'expo-router';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { dueOptions, plannerCategories, priorities, type Due, type PlannerCategory, type PlannerItem, type Priority } from '@/data/mock';
import { ButtonV3, Cells, CheckV3, ChoiceV3, FieldV3, Glass, H1V3, IconButtonV3, Kicker, LineRow, ScreenV3, SheetV3, Stat, T, TagV3, ToastV3 } from '@/design/v3/kit';
import { GUTTER_V3, radiusV3, v3 } from '@/design/v3/tokens';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { NAV_CLEARANCE } from '@/theme';
import { enter, exit, layout } from '@/theme/motion';

type Draft = { id?: string; title: string; priority: Priority; category: PlannerCategory; due: Due };

export default function PlannerV3() {
  const { t, L } = useI18n();
  const { planner, togglePlanner, removePlanner, restorePlanner, savePlanner } = useAppStore();
  const params = useLocalSearchParams<{ category?: PlannerCategory; at?: string }>();
  const [category, setCategory] = useState<PlannerCategory>(
    params.category && plannerCategories.includes(params.category) ? params.category : 'Tasks',
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Same deep-link handling as the other designs: `at` makes repeated links to one category count.
  const linkKey = `${params.category}-${params.at}`;
  const [seenLink, setSeenLink] = useState(linkKey);
  if (linkKey !== seenLink) {
    setSeenLink(linkKey);
    if (params.category && plannerCategories.includes(params.category)) setCategory(params.category);
  }

  const catLabel = (c: PlannerCategory) => t(`cat.${c}` as StringKey);
  const items = planner.filter((p) => p.category === category);
  const done = items.filter((p) => p.done).length;
  const count = (c: PlannerCategory) => planner.filter((p) => p.category === c && !p.done).length;

  const openSheet = (item?: PlannerItem) => {
    setDraft(
      item
        ? { id: item.id, title: L(item.title), priority: item.priority, category: item.category, due: item.due }
        : { title: '', priority: 'Medium', category, due: 'Today' },
    );
    setSheetOpen(true);
  };

  const submit = () => {
    if (!draft?.title.trim()) return;
    savePlanner({ ...draft, title: draft.title.trim() });
    setCategory(draft.category);
    setSheetOpen(false);
  };

  const remove = (id: string) => {
    removePlanner(id);
    setToast(t('planner.removed'));
  };

  return (
    <ScreenV3 orbs="b">
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_CLEARANCE + 10 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter.rise(0)} style={styles.head}>
          <H1V3 size={48} style={{ flex: 1 }}>
            {t('v3.planner.h1')}
          </H1V3>
          <PressableScale onPress={() => openSheet()} scaleTo={0.9} accessibilityLabel={t('planner.addTitle')} style={styles.add}>
            <Plus size={22} color={v3.white} strokeWidth={1.6} />
          </PressableScale>
        </Animated.View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {plannerCategories.map((c) => (
            <TagV3 key={c} label={catLabel(c)} count={count(c)} active={c === category} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        <Glass index={1} wrapStyle={styles.gutter}>
          <Cells>
            <Stat label={t('v3.planner.open')} value={items.length - done} />
            <Stat label={t('v3.planner.done')} value={done} />
            <Stat label={t('v3.planner.total')} value={items.length} />
          </Cells>
        </Glass>

        <View style={styles.listHead}>
          <Kicker>{catLabel(category)}</Kicker>
        </View>
        <Glass key={category} index={2} wrapStyle={styles.gutter} style={{ paddingVertical: 4 }}>
          {items.map((item, i) => (
            <Animated.View key={item.id} entering={enter.slide(i)} exiting={exit.slide} layout={layout}>
              <TaskRow item={item} first={i === 0} onToggle={() => togglePlanner(item.id)} onEdit={() => openSheet(item)} onDelete={() => remove(item.id)} />
            </Animated.View>
          ))}
          {items.length === 0 && (
            <View style={{ paddingVertical: 28, gap: 6 }}>
              <T size={20} weight="light" align="center">
                {t('planner.emptyTitle')}
              </T>
              <T size={14} color={v3.muted} align="center">
                {t('planner.emptyBody', { cat: catLabel(category) })}
              </T>
            </View>
          )}
        </Glass>
      </ScrollView>

      <ToastV3 message={toast} actionLabel={t('planner.undo')} onAction={restorePlanner} onHide={() => setToast(null)} />

      <SheetV3 visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        {draft && (
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingHorizontal: 6 }}>
            <H1V3 size={32}>{draft.id ? t('planner.editTitle') : t('planner.addTitle')}</H1V3>
            <FieldV3
              placeholder={t('planner.placeholder')}
              value={draft.title}
              onChangeText={(title) => setDraft({ ...draft, title })}
              autoFocus={!draft.id}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <Group label={t('planner.priority')}>
              <ChoiceV3 options={priorities} value={draft.priority} onChange={(v) => setDraft({ ...draft, priority: v })} format={(v) => t(`prio.${v}` as StringKey)} />
            </Group>
            <Group label={t('planner.category')}>
              <ChoiceV3 options={plannerCategories} value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} format={catLabel} />
            </Group>
            <Group label={t('planner.dueDate')}>
              <ChoiceV3 options={dueOptions} value={draft.due} onChange={(v) => setDraft({ ...draft, due: v })} format={(v) => t(`due.${v}` as StringKey)} />
            </Group>
            <View style={{ gap: 10 }}>
              <ButtonV3 label={draft.id ? t('planner.save') : t('planner.add')} onPress={submit} disabled={!draft.title.trim()} />
              <ButtonV3 label={t('common.cancel')} variant="glass" onPress={() => setSheetOpen(false)} />
            </View>
          </ScrollView>
        )}
      </SheetV3>
    </ScreenV3>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Kicker>{label}</Kicker>
      {children}
    </View>
  );
}

function TaskRow({ item, first, onToggle, onEdit, onDelete }: { item: PlannerItem; first: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const { t, L } = useI18n();
  return (
    <LineRow first={first}>
      <CheckV3 checked={item.done} onPress={onToggle} />
      <PressableScale onPress={onEdit} scaleTo={0.99} haptic={false} style={{ flex: 1, gap: 8 }}>
        <T size={16} style={item.done && { textDecorationLine: 'line-through', color: v3.muted }}>
          {L(item.title)}
        </T>
        <T size={12} color={v3.muted}>
          {[t(`due.${item.due}` as StringKey), t(`prio.${item.priority}` as StringKey), t(`tag.${item.category}` as StringKey)].join('  ·  ')}
        </T>
      </PressableScale>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <IconButtonV3 icon={Pencil} size={36} label={t('planner.editTitle')} onPress={onEdit} />
        <IconButtonV3 icon={Trash2} size={36} label={t('common.remove')} onPress={onDelete} />
      </View>
    </LineRow>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-end', gap: 16, paddingHorizontal: GUTTER_V3, marginTop: 22 },
  add: { width: 52, height: 52, borderRadius: radiusV3.pill, backgroundColor: v3.black, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tabs: { gap: 8, paddingHorizontal: GUTTER_V3, paddingVertical: 22 },
  gutter: { marginHorizontal: GUTTER_V3 },
  listHead: { paddingHorizontal: GUTTER_V3 + 4, marginTop: 30, marginBottom: 14 },
});
