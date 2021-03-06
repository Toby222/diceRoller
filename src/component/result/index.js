import './index.css';
import { events } from '../../events';
import { node } from '../../utilities/node';
import { formula } from '../formula';
import { dice } from '../dice';

export const result = {};

result.history = {};

result.history.all = [];

result.history.add = (data) => {
  result.history.all.push(JSON.parse(JSON.stringify(data)));
};

result.element = node('div|class:result');

result.count = {
  max: 50
};

result.clear = () => {
  while (result.element.lastChild) {
    result.element.removeChild(result.element.lastChild);
  };
};

result.render = () => {
  return result.element;
};

result.update = () => {
  result.clear();

  const resultToRender = JSON.parse(JSON.stringify(result.history.all)).reverse().slice(0, result.count.max);

  resultToRender.forEach((item, i) => {
    const resultItem = node('div|class:result__item');

    const resultTotal = node(`div:${item.total}|class:result__total`);

    const resultBody = node('div|class:result__details');

    const resultTimestamp = node('div|class:result__timestamp');

    resultTimestamp.textContent = `${item.timestamp.hours}:${item.timestamp.minutes}:${item.timestamp.seconds} ${item.timestamp.date}/${item.timestamp.monthString}/${item.timestamp.year}`;

    item.formula.forEach((item, i) => {
      const formula = node('div|class:result__formula');

      const formulaDice = node('div|class:result__formula-dice');

      let diceString = '';
      if (item.dice.count > 0) {
        diceString = diceString + item.dice.count;
      };
      diceString = diceString + ' d' + item.dice.size;
      if (item.dice.modifier > 0) {
        diceString = diceString + ' +' + item.dice.modifier;
      } else if (item.dice.modifier < 0) {
        diceString = diceString + ' ' + item.dice.modifier;
      };
      formulaDice.textContent = diceString;

      formula.appendChild(formulaDice);

      const formulaRolls = node('div|class:result__rolls');

      const formulaRollsTitle = node('div:Rolled\\:|class:result__rolls-title');

      const rollsList = node('ul|class:result__rolls-list list__inline list__unstyled');

      item.result.rolls.all.forEach((resultItem, i) => {
        const rollsListItem = node(`li:${resultItem}|class:result__rolls-list-item`);

        if (item.dice.size === 20 && resultItem === 20) {
          rollsListItem.classList.add('result__critical-success');
        } else if (item.dice.size === 20 && resultItem === 1) {
          rollsListItem.classList.add('result__critical-failure');
        };

        // if (i != (item.result.rolls.all.length - 1)) {
        //   rollsListItem.textContent = rollsListItem.textContent + ',';
        // };

        rollsList.appendChild(rollsListItem);
      });

      formulaRolls.appendChild(formulaRollsTitle);

      formulaRolls.appendChild(rollsList);

      formula.appendChild(formulaRolls);

      resultBody.appendChild(formula);
    });

    resultBody.appendChild(resultTimestamp);

    resultItem.appendChild(resultTotal);

    resultItem.appendChild(resultBody);

    result.element.appendChild(resultItem);
  });
};
