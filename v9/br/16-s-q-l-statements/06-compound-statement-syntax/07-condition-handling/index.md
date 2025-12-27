### 15.6.7 Gerenciamento de Condições

15.6.7.1 Declaração de Condição ... DECLARE

15.6.7.2 Declaração de Manipulador ... DECLARE

15.6.7.3 Declaração de Diagnósticos ... GET DIAGNOSTICS

15.6.7.4 Declaração de Sinalização ... RESIGNAL

15.6.7.5 Declaração de Sinalização ... SIGNAL

15.6.7.6 Regras de escopo para manipuladores

15.6.7.7 A Área de Diagnóstico do MySQL

15.6.7.8 Gerenciamento de condições e parâmetros OUT ou INOUT

Podem ocorrer condições durante a execução de programas armazenados que exigem um tratamento especial, como sair do bloco de programa atual ou continuar a execução. Manipuladores podem ser definidos para condições gerais, como avisos ou exceções, ou para condições específicas, como um código de erro particular. Condições específicas podem ser atribuídas nomes e referenciadas dessa forma nos manipuladores.

Para nomear uma condição, use a declaração `DECLARE ... CONDITION`. Para declarar um manipulador, use a declaração `DECLARE ... HANDLER`. Consulte a Seção 15.6.7.1, “Declaração de Condição ... DECLARE”, e a Seção 15.6.7.2, “Declaração de Manipulador ... DECLARE”. Para informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Para levantar uma condição, use a declaração `SIGNAL`. Para modificar as informações da condição dentro de um manipulador de condição, use `RESIGNAL`. Consulte a Seção 15.6.7.1, “Declaração de Condição ... DECLARE”, e a Seção 15.6.7.2, “Declaração de Manipulador ... DECLARE”.

Para recuperar informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte a Seção 15.6.7.3, “Declaração de Diagnósticos ... GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.