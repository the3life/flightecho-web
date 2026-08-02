import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import "dayjs/locale/tr";
import "dayjs/locale/th";
import "dayjs/locale/de";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);