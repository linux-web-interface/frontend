export function convertSize(size) {
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    for (const unit of units) {
        if (size < 1024 || unit === "YB") {
            return `${size.toFixed(2)} ${unit}`;
        }

        size /= 1024;
    }
}
