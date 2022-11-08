const currentDateTimeFormatted = () => {
   const date = new Date();

   options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
   };

   // 06/11/2022 15:37:13
   const dateTime = new Intl.DateTimeFormat('pt-BR', options).format(date);

   // formatando data e hora
   const dateFormatted = dateTime.substring(0, 10);
   const timeFormatted = dateTime.substring(11, 19);

   // concatena a data e hora neste formato: 06/11/2022 - 15:37:13
   // const dateTimeFormatted = dateFormatted + ' - ' + timeFormatted;

   // retorna um array com data e hora neste formato: [06/11/2022, 15:37:13]
   return [dateFormatted, timeFormatted];
};
