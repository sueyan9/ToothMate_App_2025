class ChartInstanceClass {
  constructor(id, top, right, name) {
    this.id = id;
    this.top = top;
    this.right = right;
    this.name = name;
    this.values = [];
    this.output = '';
  }
}

ChartInstanceClass.prototype.addValue = function (value) {
  this.values.push(value);
  this.output += `${value}\n`;
};

export default ChartInstanceClass;
