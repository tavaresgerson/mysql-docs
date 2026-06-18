### 13.6.7 Tratamento de Condições (Condition Handling)

13.6.7.1 Instrução DECLARE ... CONDITION

13.6.7.2 Instrução DECLARE ... HANDLER

13.6.7.3 Instrução GET DIAGNOSTICS

13.6.7.4 Instrução RESIGNAL

13.6.7.5 Instrução SIGNAL

13.6.7.6 Regras de Escopo para Handlers

13.6.7.7 A Área de Diagnósticos do MySQL (Diagnostics Area)

13.6.7.8 Tratamento de Condições e Parâmetros OUT ou INOUT

13.6.7.9 Restrições no Tratamento de Condições

Condições podem surgir durante a execução de programas armazenados que exigem tratamento especial, como sair do bloco de programa atual ou continuar a execução. **Handlers** podem ser definidos para condições gerais, como warnings ou exceptions, ou para condições específicas, como um código de erro particular. Condições específicas podem receber nomes e ser referenciadas dessa forma nos **handlers**.

Para nomear uma condição, use a instrução `DECLARE ... CONDITION`. Para declarar um **handler**, use a instrução `DECLARE ... HANDLER`. Consulte Seção 13.6.7.1, “Instrução DECLARE ... CONDITION”, e Seção 13.6.7.2, “Instrução DECLARE ... HANDLER”. Para informações sobre como o servidor escolhe os **handlers** quando uma condição ocorre, consulte Seção 13.6.7.6, “Regras de Escopo para Handlers”.

Para levantar uma condição, use a instrução `SIGNAL`. Para modificar informações da condição dentro de um **condition handler**, use `RESIGNAL`. Consulte Seção 13.6.7.1, “Instrução DECLARE ... CONDITION”, e Seção 13.6.7.2, “Instrução DECLARE ... HANDLER”.

Para recuperar informações da área de diagnósticos, use a instrução `GET DIAGNOSTICS` (consulte Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnósticos, consulte Seção 13.6.7.7, “A Área de Diagnósticos do MySQL (Diagnostics Area)”").