export class Tag {
  id: string;
  name: string;
  slug: string;
  color: string;

  luminance(): string {
        const color = this.color || '#000000';
        const number_color = parseInt(color.slice(1), 16);
        const r = (number_color & 0xff0000) >> 16;
        const g = (number_color & 0xff00) >> 8;
        const b = (number_color & 0xff);
        if ((r * 0.299 + g * 0.587 + b * 0.114) / 256.0 < 0.5) {
            return '#FFFFFF';
        } else {
            return '#000000';
        }
    }
}
