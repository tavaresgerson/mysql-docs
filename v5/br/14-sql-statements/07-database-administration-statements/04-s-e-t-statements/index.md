### 13.7.4 Declarações SET

13.7.4.1 Sintaxe de definição de variáveis para atribuição

13.7.4.2 Declaração de conjunto de caracteres do personagem

13.7.4.3 Declaração de NOME_SET

A instrução `SET` tem várias formas. As descrições dessas formas que não estão associadas a uma capacidade específica do servidor aparecem em subseções desta seção:

- `SET var_name = value` permite atribuir valores a variáveis que afetam o funcionamento do servidor ou dos clientes. Veja Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

- `SET CHARACTER SET` e `SET NAMES` atribuem valores às variáveis de conjunto de caracteres e coligação associadas à conexão atual com o servidor. Veja Seção 13.7.4.2, “Instrução SET CHARACTER SET” e Seção 13.7.4.3, “Instrução SET NAMES”.

As descrições para os outros formulários aparecem em outros lugares, agrupadas com outras declarações relacionadas à capacidade que ajudam a implementar:

- `SET PASSWORD` atribui senhas de conta. Veja Seção 13.7.1.7, “Instrução SET PASSWORD”.

- `SET TRANSACTION ISOLATION LEVEL` define o nível de isolamento para o processamento de transações. Veja Seção 13.3.6, “Instrução SET TRANSACTION”.
