### 7.1.2 Configurações Padrão do Servidor

O servidor MySQL tem muitos parâmetros de operação, que você pode alterar durante a inicialização do servidor usando opções de linha de comando ou arquivos de configuração (arquivos de opção). Também é possível alterar muitos parâmetros durante a execução. Para instruções gerais sobre como definir parâmetros durante a inicialização ou execução, consulte a Seção 7.1.7, “Opções de Comando do Servidor”, e a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

No Windows, o Instalador do MySQL interage com o usuário e cria um arquivo chamado `my.ini` no diretório de instalação base como o arquivo de opção padrão.

Observação

No Windows, a extensão do arquivo de opção `.ini` ou `.cnf` pode não ser exibida.

Após completar o processo de instalação, você pode editar o arquivo de opção padrão a qualquer momento para modificar os parâmetros usados pelo servidor. Por exemplo, para usar um parâmetro definido no arquivo que está comentado com o caractere `#` no início da linha, remova o `#` e modifique o valor do parâmetro, se necessário. Para desabilitar um ajuste, adicione um `#` no início da linha ou remova-o.

Para plataformas que não são do Windows, nenhum arquivo de opção padrão é criado durante a instalação do servidor ou o processo de inicialização do diretório de dados. Crie seu arquivo de opção seguindo as instruções dadas na Seção 6.2.2.2, “Usando Arquivos de Opção”. Sem um arquivo de opção, o servidor apenas começa com suas configurações padrão—consulte a Seção 7.1.2, “Configurações Padrão do Servidor” para saber como verificar essas configurações.

Para informações adicionais sobre o formato e a sintaxe do arquivo de opção, consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.