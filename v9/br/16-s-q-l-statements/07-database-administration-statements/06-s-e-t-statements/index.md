### 15.7.6 Declarações `SET`

15.7.6.1 Sintaxe `SET` para Atribuição de Variáveis

15.7.6.2 Declaração `SET CHARACTER SET`

15.7.6.3 Declaração `SET NAMES`

A declaração `SET` tem várias formas. As descrições dessas formas que não estão associadas a uma capacidade específica do servidor aparecem em subseções desta seção:

* `SET var_name = value` permite atribuir valores a variáveis que afetam o funcionamento do servidor ou dos clientes. Veja a Seção 15.7.6.1, “Sintaxe `SET` para Atribuição de Variáveis”.

* `SET CHARACTER SET` e `SET NAMES` atribuem valores a variáveis de conjunto de caracteres e coligação associadas à conexão atual com o servidor. Veja a Seção 15.7.6.2, “Declaração `SET CHARACTER SET`”, e a Seção 15.7.6.3, “Declaração `SET NAMES`”.

As descrições das outras formas aparecem em outros lugares, agrupadas com outras declarações relacionadas à capacidade que ajudam a implementar:

* `SET DEFAULT ROLE` e `SET ROLE` definem o papel padrão e o papel atual para contas de usuário. Veja a Seção 15.7.1.9, “Declaração `SET DEFAULT ROLE`”, e a Seção 15.7.1.11, “Declaração `SET ROLE`”.

* `SET PASSWORD` atribui senhas de conta. Veja a Seção 15.7.1.10, “Declaração `SET PASSWORD`”.

* `SET RESOURCE GROUP` atribui threads a um grupo de recursos. Veja a Seção 15.7.2.4, “Declaração `SET RESOURCE GROUP`”.

* `SET TRANSACTION ISOLATION LEVEL` define o nível de isolamento para o processamento de transações. Veja a Seção 15.3.7, “Declaração `SET TRANSACTION`”.