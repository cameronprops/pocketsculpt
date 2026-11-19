# User templates

Pocket Sculpt templates are ordinary editable Pocket Sculpt JSON project snapshots. In the app, open Settings and select **Export current as template**. You can save the JSON file to this folder in a Git checkout and share it through the repository.

To use a shared template, download its JSON and choose **Open project or template file** on the startup screen. Opening a template starts from that saved snapshot; save your own copy under a new name. Review files before sharing, as they may contain sculpt geometry, connector settings, metadata and project-specific content.

The app's browser gallery is stored locally in that browser's IndexedDB and is not automatically synchronized to Git. Opening downloaded HTML files through different browser origins or clearing site data can make locally saved gallery items unavailable. Use exported files as backups. There is no in-app Git login, template publishing, cloud sync, thumbnail generation or remote gallery yet.
