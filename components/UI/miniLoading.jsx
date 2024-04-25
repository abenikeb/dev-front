export const MiniLoading = (props) => {
  return props.isLoading ? (
    <div
      class="
                z-50
                fixed
                top-0
                left-0
                w-full
                h-full
                bg-white bg-opacity-50
                flex
                justify-center
                items-center
                "
    >
      <div class="loadingio-spinner-ellipsis-wsclip50o6q z-50">
        <div class="ldio-zejxqo2x1aq">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  ) : null;
};
