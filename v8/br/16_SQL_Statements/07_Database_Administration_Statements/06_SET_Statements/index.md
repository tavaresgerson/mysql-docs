### 15.7.6 Declarações SET

15.7.6.1 Sintaxe de definição para atribuição de variáveis

15.7.6.2 Declaração de conjunto de caracteres de caractere SET

15.7.6.3 Declaração de NOME\_SET

A declaração `SET` tem várias formas. As descrições dessas formas que não estão associadas a uma capacidade específica do servidor aparecem em subseções desta seção:

- `SET var_name = value` permite que você atribua valores a variáveis que afetam o funcionamento do servidor ou dos clientes. Veja a Seção 15.7.6.1, “Sintaxe de definição para atribuição de variáveis”.

- `SET CHARACTER SET` e `SET NAMES` atribuem valores às variáveis de conjunto de caracteres e ordenação associadas à conexão atual com o servidor. Veja a Seção 15.7.6.2, “Instrução SET CHARACTER SET”, e a Seção 15.7.6.3, “Instrução SET NAMES”.

As descrições para os outros formulários aparecem em outros lugares, agrupadas com outras declarações relacionadas à capacidade que ajudam a implementar:

- `SET DEFAULT ROLE` e `SET ROLE` definem o papel padrão e o papel atual das contas de usuário. Consulte a Seção 15.7.1.9, “Instrução SET DEFAULT ROLE”, e a Seção 15.7.1.11, “Instrução SET ROLE”.

- `SET PASSWORD` atribui senhas de conta. Veja a Seção 15.7.1.10, “Instrução SET PASSWORD”.

- `SET RESOURCE GROUP` atribui threads a um grupo de recursos. Veja a Seção 15.7.2.4, “Instrução SET RESOURCE GROUP”.

- `SET TRANSACTION ISOLATION LEVEL` define o nível de isolamento para o processamento de transações. Veja a Seção 15.3.7, “Instrução SET TRANSACTION”.
