import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ActionSheet, ActionSheetItem } from '@/components/ui/action-sheet';
import { Button } from '@/components/ui/button';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

// Simple icons
function CameraIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>📷</Text>
    </View>
  );
}

function GalleryIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>🖼</Text>
    </View>
  );
}

function TrashIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>🗑</Text>
    </View>
  );
}

function ShareIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>↗</Text>
    </View>
  );
}

function CopyIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>📋</Text>
    </View>
  );
}

function EditIcon({ width = 22, height = 22, color = '#000' }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: width * 0.8, color }}>✏️</Text>
    </View>
  );
}

export function ActionSheetDemo() {
  const { colors } = useTheme();
  const [photoSheet, setPhotoSheet] = useState(false);
  const [shareSheet, setShareSheet] = useState(false);
  const [menuSheet, setMenuSheet] = useState(false);
  const [statesSheet, setStatesSheet] = useState(false);

  const showAlert = (message: string) => {
    Alert.alert('Action', message);
  };

  return (
    <View style={styles.container}>
      <Section title="Photo Options">
        <Button onPress={() => setPhotoSheet(true)}>Open Photo Actions</Button>
        <ActionSheet
          open={photoSheet}
          onOpenChange={setPhotoSheet}
          title="Photo Options"
          message="Choose an action for this photo"
        >
          <ActionSheetItem
            icon={<CameraIcon />}
            onPress={() => showAlert('Take Photo')}
          >
            Take Photo
          </ActionSheetItem>
          <ActionSheetItem
            icon={<GalleryIcon />}
            onPress={() => showAlert('Choose from Library')}
          >
            Choose from Library
          </ActionSheetItem>
          <ActionSheetItem
            icon={<TrashIcon />}
            destructive
            onPress={() => showAlert('Delete Photo')}
          >
            Delete Photo
          </ActionSheetItem>
        </ActionSheet>
      </Section>

      <Section title="Share Menu">
        <Button variant="secondary" onPress={() => setShareSheet(true)}>
          Open Share Menu
        </Button>
        <ActionSheet
          open={shareSheet}
          onOpenChange={setShareSheet}
          title="Share"
        >
          <ActionSheetItem
            icon={<CopyIcon />}
            onPress={() => showAlert('Copy Link')}
          >
            Copy Link
          </ActionSheetItem>
          <ActionSheetItem
            icon={<ShareIcon />}
            onPress={() => showAlert('Share via...')}
          >
            Share via...
          </ActionSheetItem>
        </ActionSheet>
      </Section>

      <Section title="Context Menu">
        <Button variant="outline" onPress={() => setMenuSheet(true)}>
          Open Context Menu
        </Button>
        <ActionSheet
          open={menuSheet}
          onOpenChange={setMenuSheet}
        >
          <ActionSheetItem
            icon={<EditIcon />}
            onPress={() => showAlert('Edit')}
          >
            Edit
          </ActionSheetItem>
          <ActionSheetItem
            icon={<CopyIcon />}
            onPress={() => showAlert('Duplicate')}
          >
            Duplicate
          </ActionSheetItem>
          <ActionSheetItem disabled>
            Move (disabled)
          </ActionSheetItem>
          <ActionSheetItem
            icon={<TrashIcon />}
            destructive
            onPress={() => showAlert('Delete')}
          >
            Delete
          </ActionSheetItem>
        </ActionSheet>
      </Section>

      <Section title="Item States">
        <Button variant="outline" onPress={() => setStatesSheet(true)}>
          Open Item States Demo
        </Button>
        <ActionSheet
          open={statesSheet}
          onOpenChange={setStatesSheet}
          title="Item States"
        >
          <ActionSheetItem icon={<EditIcon />} onPress={() => { setStatesSheet(false); showAlert('Normal'); }}>
            Normal Item
          </ActionSheetItem>
          <ActionSheetItem disabled>
            Disabled Item
          </ActionSheetItem>
          <ActionSheetItem icon={<TrashIcon />} destructive onPress={() => { setStatesSheet(false); showAlert('Destructive'); }}>
            Destructive Item
          </ActionSheetItem>
        </ActionSheet>
      </Section>

      <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
        Swipe down or tap outside to dismiss
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 8 },
});
