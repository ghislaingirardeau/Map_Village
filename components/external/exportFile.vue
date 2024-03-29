<template>
  <div>
    <p v-if="!errorMessage">Export to CSV file, type the new file name to download it</p>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <v-form v-else ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="fileName"
        :counter="20"
        :rules="fileNameRules"
        label="File name"
        required
      ></v-text-field>
    </v-form>
    <v-spacer></v-spacer>
    <v-btn
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="convertMyJson"
      v-if="!errorMessage"
    >
      Save
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    valid: true,
    errorMessage: undefined,
    fileName: "",
    fileNameRules: [
      (v) => !!v || "A file name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20 characters",
    ],
  }),
  computed: {
    ...mapState(['GeoJsonDatas']),
  },
  methods: {
    convertMyJson() {
      function convertToCSV(objArray) {
        var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
        var str = "";
        for (var i = 0; i < array.length; i++) {
          var line = "";
          for (var index in array[i]) {
            if (line != "") line += ",";

            line += array[i][index];
          }

          str += line + "\r\n";
        }

        return str;
      }

      function exportCSVFile(headers, items, fileTitle) {
        if (headers) {
          items.unshift(headers);
        }

        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);
        var csv = convertToCSV(jsonObject);

        var exportedFilename = fileTitle + ".csv" || "export.csv";

        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, exportedFilename);
        } else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }

      let download = (jsonToConvert) => {
        var headers = {
          id: "id",
          category: "category",
          subCategory: "subCategory",
          type: "type",
          name: "name",
          comment: "popupContent",
          time: "time",
          coordinates: "coordinates",
          icon: "icon",
          color: "color",
          data: "let column empty"
        };

        var itemsNotFormatted = jsonToConvert;

        var itemsFormatted = [];

        // format the data

        itemsNotFormatted.forEach((item) => {
          let coordinates;
          if (item.geometry.coordinates.length === 2) {
            coordinates = item.geometry.coordinates.join(" ");
          } else {
            let arrayPolygon = item.geometry.coordinates;
            let coordinatesToString = arrayPolygon[0].join("/");
            coordinates = coordinatesToString.replace(/,/g, " ");
          }
          itemsFormatted.push({
            id: item.properties.id,
            category: item.properties.category,
            subCategory: item.properties.subCategory ? item.properties.subCategory : '', // when parse JSON consider '' as undefined
            type: item.geometry.type,
            name: item.properties.name,
            comment: item.properties.popupContent,
            time: item.properties.time,
            coordinates: coordinates,
            icon: item.icon.type,
            color: item.icon.color,
            data: ''
          });
        });

        var fileTitle = this.fileName;

        exportCSVFile(headers, itemsFormatted, fileTitle);
      };
      if (this.$refs.form.validate()) {
        try {
          let allDatas = Object.values(this.GeoJsonDatas).flat()
          download(allDatas);
          this.errorMessage = "Your CSV file is downloaded";
        } catch (error) {
          this.errorMessage = "Failed to save the file, save first your data on map !";
        }
      }
    },
  },
};
</script>
