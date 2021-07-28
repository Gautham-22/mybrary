FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
    FilePondPluginImagePreview
);

FilePond.setOptions({
    stylePanelAspectRatio : 225/200,
    imageResizeTargetWidth : 200,
    imageResizeTargetHeight : 225
})

FilePond.parse(document.body);