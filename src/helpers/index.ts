import { PrFieldError } from "@/youtrack/youtrackApi";
import { prData } from "@/types";

function checkTextHasPrLink(text: string, prLink: string): boolean {
  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!text.match(regexPrLink);
  return textHasPrLink;
}

export function changePrTitleInText(text: string, pr: prData): string {
  const textHasPrLink = checkTextHasPrLink(text, pr.link);

  if (!textHasPrLink)
    throw new PrFieldError(
      `pull request с ссылкой: ${pr.link} не найден в списке`
    );

  const regexPrTitle = new RegExp(`(?<=${pr.link} - )[^~\\n]+`);
  const newText = text.replace(regexPrTitle, pr.titleWithoutTaskNum);

  return newText;
}
export function addPrInText(text: string, pr: prData, merged: boolean = false) {
  const status = merged ? "x" : " ";

  let newText = `- [${status}]${pr.link} - ${pr.titleWithoutTaskNum}\n`;

  const textHasPrLink = checkTextHasPrLink(text, pr.link);

  if (textHasPrLink)
    throw new PrFieldError(
      `Добовляемая ссылка на pull request: ${pr.link} уже есть в списке`
    );

  const textHasLineBreakInTheEnd = !!text.match(/\n$/);
  newText = textHasLineBreakInTheEnd
    ? `${text}${newText}`
    : `${text}\n${newText}`;

  return newText;
}
export function delPrFromText(text: string, pr: prData) {
  const textHasPrLink = checkTextHasPrLink(text, pr.link);

  if (!textHasPrLink)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${pr.link} не найдена в списке`
    );

  const regexPrLinkCheckbox = new RegExp(
    `- \\[.]${pr.link} - ${pr.titleWithoutTaskNum}`
  );
  const newText = text.replace(
    regexPrLinkCheckbox,
    `~~${pr.link} - ${pr.titleWithoutTaskNum}~~`
  );

  return newText;
}
export function reAddPrInText(text: string, pr: prData) {
  const textHasPrLink = checkTextHasPrLink(text, pr.link);

  if (!textHasPrLink) return addPrInText(text, pr);

  const regexPrLinkСrossedOut = new RegExp(
    `~~${pr.link} - ${pr.titleWithoutTaskNum}~~`
  );
  const newText = text.replace(
    regexPrLinkСrossedOut,
    `- [ ]${pr.link} - ${pr.titleWithoutTaskNum}`
  );

  return newText;
}
export function updMergeStatusOfPrInText(
  text: string,
  pr: prData,
  merged: boolean
) {
  const textHasPrLink = checkTextHasPrLink(text, pr.link);

  if (!textHasPrLink) return addPrInText(text, pr, true);

  const status = merged ? "x" : " ";

  const regexPrLinkCheckbox = new RegExp(`- \\[.](?=${pr.link}\\b)`, "g");
  const newText = text.replace(regexPrLinkCheckbox, `- [${status}]`);

  return newText;
}
