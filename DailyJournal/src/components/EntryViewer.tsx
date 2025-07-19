import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import {
  Appbar,
  Text,
  Chip,
  Button,
  Card,
  Divider,
} from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import { JournalEntry } from '../services/JournalService';

interface EntryViewerProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  onClose: () => void;
}

export default function EntryViewer({ entry, onEdit, onDelete, onClose }: EntryViewerProps) {
  const richText = React.useRef<RichEditor>(null);

  React.useEffect(() => {
    if (richText.current) {
      richText.current.setContentHTML(entry.content);
    }
  }, [entry.content]);

  const handleShare = async () => {
    try {
      const content = `${entry.title}\n\n${entry.content.replace(/<[^>]*>/g, '')}\n\nTags: ${entry.tags.join(', ')}`;
      await Share.share({
        message: content,
        title: entry.title,
      });
    } catch (error) {
      console.error('Failed to share entry:', error);
    }
  };

  const handleDelete = () => {
    onDelete(entry.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onClose} />
        <Appbar.Content title={entry.title} />
        <Appbar.Action icon="share" onPress={handleShare} />
        <Appbar.Action icon="pencil" onPress={() => onEdit(entry)} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.metaCard}>
          <Card.Content>
            <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
            {entry.updatedAt !== entry.createdAt && (
              <Text style={styles.updatedDate}>
                Updated: {formatDate(entry.updatedAt)}
              </Text>
            )}
            
            {(entry.mood || entry.weather || entry.location) && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.metaRow}>
                  {entry.mood && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Mood:</Text>
                      <Text style={styles.metaValue}>{entry.mood}</Text>
                    </View>
                  )}
                  {entry.weather && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Weather:</Text>
                      <Text style={styles.metaValue}>{entry.weather}</Text>
                    </View>
                  )}
                </View>
                
                {entry.location && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Location:</Text>
                    <Text style={styles.metaValue}>{entry.location}</Text>
                  </View>
                )}
              </>
            )}
            
            {entry.tags.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.tagsLabel}>Tags:</Text>
                <View style={styles.tagsContainer}>
                  {entry.tags.map(tag => (
                    <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.contentCard}>
          <Card.Content>
            <RichEditor
              ref={richText}
              style={styles.richEditor}
              disabled
              hideKeyboardAccessoryView
              initialContentHTML={entry.content}
            />
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => onEdit(entry)}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Entry
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metaCard: {
    marginBottom: 16,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  updatedDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flex: 1,
    marginRight: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
  },
  tagsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  contentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  richEditor: {
    minHeight: 200,
    backgroundColor: 'transparent',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButton: {
    minWidth: 150,
  },
});