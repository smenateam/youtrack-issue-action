import { PrFieldError } from "@/youtrack/youtrackApi";
import { PrField } from "@/types/youtrack";

export function addPrLinkInPrField(
  prField: PrField,
  prLink: string,
  merged: boolean = false
) {
  const status = merged ? "x" : " ";

  const oldPrFieldValue = prField.value;

  const newPrFieldValue = {
    text: `- [${status}]${prLink}\n`,
  };

  if (oldPrFieldValue) {
    const regexPrLink = new RegExp(`${prLink}\\b`);
    const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

    if (textHasPrLink)
      throw new PrFieldError(
        `Добовляемая ссылка на pull request: ${prLink} уже есть в описании`
      );

    const textHasLineBreakInTheEnd = !!oldPrFieldValue.text.match(/\n$/);
    newPrFieldValue.text = textHasLineBreakInTheEnd
      ? `${oldPrFieldValue.text}${newPrFieldValue.text}`
      : `${oldPrFieldValue.text}\n${newPrFieldValue.text}`;
  }

  prField.value = newPrFieldValue;

  return prField;
}
export function crossOutPrLinkInPrField(prField: PrField, prLink: string) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена, т.к. описание пустое`
    );

  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена в описании`
    );

  const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(regexPrLinkCheckbox, `~~${prLink}~~`),
  };

  prField.value = newPrFieldValue;

  return prField;
}
export function reAddPrLinkInPrField(prField: PrField, prLink: string) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue) return addPrLinkInPrField(prField, prLink);

  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink) return addPrLinkInPrField(prField, prLink);

  const regexPrLinkСrossedOut = new RegExp(`~~${prLink}~~`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(regexPrLinkСrossedOut, `- [ ]${prLink}`),
  };
  prField.value = newPrFieldValue;

  return prField;
}
export function updateCheckboxPrLinkInPrField(
  prField: PrField,
  prLink: string,
  merged: boolean
) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue) return addPrLinkInPrField(prField, prLink, true);

  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink) return addPrLinkInPrField(prField, prLink, true);

  const status = merged ? "x" : " ";

  const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(
      regexPrLinkCheckbox,
      `- [${status}]${prLink}`
    ),
  };
  prField.value = newPrFieldValue;

  return prField;
}
