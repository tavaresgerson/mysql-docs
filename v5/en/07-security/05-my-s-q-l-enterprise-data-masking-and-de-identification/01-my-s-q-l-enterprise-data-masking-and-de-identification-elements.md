### 6.5.1 Elementos de Mascaramento e Desidentificação de Dados do MySQL Enterprise

O Mascaramento e Desidentificação de Dados do MySQL Enterprise é baseado em uma biblioteca de plugin que implementa estes elementos:

* Um plugin do lado do servidor (server-side plugin) chamado `data_masking`.
* Um conjunto de funções carregáveis fornece uma API no nível SQL para realizar operações de mascaramento e desidentificação. Algumas dessas funções exigem o privilégio [[`SUPER`](privileges-provided.html#priv_super)].