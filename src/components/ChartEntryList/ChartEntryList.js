import ChartInstanceClass from './ChartInstanceClass';
import { TOP_POSITION_ARRAY, RIGHT_POSITION_ARRAY, NAME_ARRAY } from './ChartEntryUtils';

class ChartEntryList {
  constructor() {
    this.allEntries = [];
  }
}

ChartEntryList.prototype.addChartInstance = function (value) {
  this.allEntries.push(value);
};

ChartEntryList.prototype.updateValue = function (index, value) {
  this.allEntries[index].addValue(value);
};

ChartEntryList.prototype.initList = function () {
  for (let index = 0; index < 32; index++) {
    const x = new ChartInstanceClass(index, TOP_POSITION_ARRAY[index], RIGHT_POSITION_ARRAY[index], NAME_ARRAY[index]);
    this.addChartInstance(x);
  }
};

ChartEntryList.prototype.viewList = function () {
  console.log(this.allEntries);
};

export default ChartEntryList;
