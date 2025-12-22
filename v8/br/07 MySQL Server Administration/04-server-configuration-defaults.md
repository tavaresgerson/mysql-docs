### 7.1.2 Configuração padrão do servidor

O servidor MySQL tem muitos parâmetros operacionais, que você pode alterar na inicialização do servidor usando opções de linha de comando ou arquivos de configuração (arquivos de opção).

No Windows, o MySQL Installer interage com o usuário e cria um arquivo chamado `my.ini` no diretório de instalação base como o arquivo de opção padrão.

::: info Note

No Windows, a extensão de arquivo de opção `.ini` ou `.cnf` pode não ser exibida.

:::

Depois de completar o processo de instalação, você pode editar o arquivo de opções padrão a qualquer momento para modificar os parâmetros usados pelo servidor. Por exemplo, para usar uma configuração de parâmetro no arquivo que é comentado com um `#` caractere no início da linha, remova o `#`, e modifique o valor do parâmetro, se necessário. Para desativar uma configuração, adicione um `#` no início da linha ou remova-o.

Para plataformas não Windows, nenhum arquivo de opção padrão é criado durante a instalação do servidor ou o processo de inicialização do diretório de dados. Crie seu arquivo de opção seguindo as instruções dadas na Seção 6.2.2.2, "Utilizando Arquivos de Opção". Sem um arquivo de opção, o servidor apenas começa com suas configurações padrão.

Para obter informações adicionais sobre o formato e a sintaxe do ficheiro de opções, ver secção 6.2.2.2, "Utilização de ficheiros de opções".
