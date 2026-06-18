### 15.6.7 Tratamento de Condições

15.6.7.1 DECLARE ... CONDITION Statement

15.6.7.2 DECLARE ... HANDLER Statement

15.6.7.3 Declaração de DIAGNÓSTICOS

15.6.7.4 Declaração RESIGNAL

15.6.7.5 Declaração de SINAL

15.6.7.6 Regras de escopo para manipuladores

15.6.7.7 Área de Diagnóstico do MySQL

15.6.7.8 Gerenciamento de Condições e Parâmetros OUT ou INOUT

Durante a execução de programas armazenados, podem surgir condições que exigem um tratamento especial, como sair do bloco de programa atual ou continuar a execução. Podem ser definidos manipuladores para condições gerais, como avisos ou exceções, ou para condições específicas, como um código de erro particular. Condições específicas podem receber nomes e serem referenciadas dessa forma nos manipuladores.

Para nomear uma condição, use a declaração `DECLARE ... CONDITION`. Para declarar um manipulador, use a declaração `DECLARE ... HANDLER`. Consulte a Seção 15.6.7.1, “DECLARE ... CONDIÇÃO”, e a Seção 15.6.7.2, “DECLARE ... MANIPULADOR”. Para informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Para criar uma condição, use a instrução `SIGNAL`. Para modificar as informações da condição dentro de um manipulador de condição, use `RESIGNAL`. Veja a Seção 15.6.7.1, “Instrução DECLARE ... CONDITION”, e a Seção 15.6.7.2, “Instrução DECLARE ... HANDLER”.

Para recuperar informações da área de diagnóstico, use a instrução `GET DIAGNOSTICS` (consulte a Seção 15.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.
